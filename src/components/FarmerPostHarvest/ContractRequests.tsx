"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Contract } from '@/types/contracts';
import ContractCard from './ContractCard';
import { ethers, BrowserProvider } from "ethers";
import { ContractLog, FarmContractDetails, DeliveryStatus } from '@/types/blockchain';

// Use the single FarmContract address
const FARM_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYED_BLOCKCHAIN_FACTORY_CONTRACT_ADDRESS as string;

if (!FARM_CONTRACT_ADDRESS) {
  throw new Error("Please set the NEXT_PUBLIC_DEPLOYED_BLOCKCHAIN_FACTORY_CONTRACT_ADDRESS environment variable");
}

// FarmContract ABI
const FARM_CONTRACT_ABI = [
  "function createContract(address _farmer, string memory _cropName, uint256 _price, uint256 _expectedDeliveryDate, string memory _farmerOtp, string memory _contractorOtp) external returns (uint256)",
  "function getContract(uint256 _contractId) external view returns (tuple(uint256 id, address farmer, address contractor, string cropName, uint256 price, uint256 expectedDeliveryDate, uint8 deliveryStatus, bytes32 farmerOtpHash, bytes32 contractorOtpHash))",
  "function updateStatus(uint256 _contractId, uint8 _status) external",
  "function verifyOtp(uint256 _contractId, string memory _otp) external view returns (bool)",
  "event ContractCreated(uint256 indexed contractId, address indexed farmer, address indexed contractor, string cropName, uint256 price, uint256 expectedDeliveryDate)",
  "event StatusUpdated(uint256 indexed contractId, uint8 status)"
];

export default function ContractRequests({ farmerId }: { farmerId: string }) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchContracts = async () => {
    try {
      const supabase = createClient();

      // First, get the farmer's registration ID
      const { data: farmerData, error: farmerError } = await supabase
        .from('farmer_registrations')
        .select('id, user_id')
        .eq('user_id', farmerId)
        .single();

      if (farmerError) throw farmerError;

      // Then fetch contracts using the farmer's registration ID
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          buyer:buyer_registrations!buyer_id(
            id,
            user_id,
            name,
            address,
            state,
            phone_number
          )
        `)
        .eq('farmer_id', farmerData.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error: unknown) {
      console.error('Error fetching contracts:', error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch contract requests"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptContract = async (contract: Contract, status: 'accepted' | 'rejected') => {
    try {
      const supabase = createClient();

      if (status === 'accepted') {
        if (!window.ethereum) {
          throw new Error("MetaMask is not installed");
        }

        const provider = new BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const farmerAddress = await signer.getAddress();

        // Create FarmContract instance
        const farmContract = new ethers.Contract(FARM_CONTRACT_ADDRESS, FARM_CONTRACT_ABI, signer);

        // Generate OTPs
        const buyerOtp = Math.random().toString(36).slice(-6).toUpperCase();
        const farmerOtp = Math.random().toString(36).slice(-6).toUpperCase();

        console.log("Generated OTPs:", { farmerOtp, buyerOtp });

        // Create the contract on blockchain
        const tx = await farmContract.createContract(
          farmerAddress, // farmer address
          contract.crop_name,
          ethers.parseEther(Number(contract.price).toFixed(18)), // price in wei
          Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
          farmerOtp,
          buyerOtp
        );

        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction receipt:", receipt);

        // Find the ContractCreated event in the logs
        const contractCreatedEvent = receipt.logs.find((log:ContractLog) => {
          try {
            const parsedLog = farmContract.interface.parseLog({
              topics: log.topics as string[],
              data: log.data,
            });
            return parsedLog?.name === "ContractCreated";
          } catch {
            return false;
          }
        });

        if (!contractCreatedEvent) {
          throw new Error("Contract creation event not found");
        }

        const parsedEvent = farmContract.interface.parseLog({
          topics: contractCreatedEvent.topics as string[],
          data: contractCreatedEvent.data,
        });
        const contractIdOnChain = parsedEvent?.args[0];
        
        if (!contractIdOnChain) {
          throw new Error("Contract ID not found in event");
        }

        console.log("Contract created successfully!");
        console.log("On-chain Contract ID:", contractIdOnChain.toString());
        console.log("Block number:", receipt.blockNumber);
        console.log("Transaction hash:", receipt.hash);

        // Fetch and log the created contract details
        try {
          const contractDetails: FarmContractDetails = await farmContract.getContract(contractIdOnChain);
          console.log("Contract Details from Blockchain:", {
            id: contractDetails.id.toString(),
            farmer: contractDetails.farmer,
            contractor: contractDetails.contractor,
            cropName: contractDetails.cropName,
            price: ethers.formatEther(contractDetails.price),
            expectedDeliveryDate: new Date(Number(contractDetails.expectedDeliveryDate) * 1000).toISOString(),
            deliveryStatus: DeliveryStatus[contractDetails.deliveryStatus] || contractDetails.deliveryStatus.toString(),
            farmerOtpHash: contractDetails.farmerOtpHash,
            contractorOtpHash: contractDetails.contractorOtpHash
          });
        } catch (fetchError: unknown) {
          console.error("Error fetching contract details:", fetchError);
        }

        // Store in ongoing_post_harvest_contracts
        console.log("Inserting into Supabase:", {
          contract_id: contract.id,
          farmer_otp: farmerOtp,
          buyer_otp: buyerOtp,
          contract_address: FARM_CONTRACT_ADDRESS,
          block_no: receipt.blockNumber.toString(),
          delivery_status: 'pending'
        });

        console.log("On-chain Contract ID (for reference):", contractIdOnChain.toString());
        console.log("Transaction Hash (for reference):", receipt.hash);

        const { data: insertedData, error: insertError } = await supabase
          .from('ongoing_post_harvest_contracts')
          .insert({
            contract_id: contract.id,
            farmer_otp: farmerOtp,
            buyer_otp: buyerOtp,
            contract_address: FARM_CONTRACT_ADDRESS,
            block_no: receipt.blockNumber.toString(),
            delivery_status: 'pending'
          })
          .select();

        if (insertError) {
          console.error("Supabase insert error:", insertError);
          throw insertError;
        }

        console.log("Successfully inserted into Supabase:", insertedData);
        
      } else {
        // Store in rejected_contracts
        await supabase
          .from('rejected_contracts')
          .insert([{
            buyer_id: contract.buyer_id,
            farmer_id: contract.farmer_id,
            type: contract.type,
            price: contract.price,
            crop_name: contract.crop_name,
            status: 'rejected'
          }]);

        console.log("Contract rejected and stored in rejected_contracts");
      }

      // Update contract status
      const { error: updateError } = await supabase
        .from('contracts')
        .update({ status })
        .eq('id', contract.id);

      if (updateError) {
        console.error("Error updating contract status:", updateError);
        throw updateError;
      }

      setContracts(contracts.filter(c => c.id !== contract.id));
      toast({
        title: "Success",
        description: `Contract ${status} successfully`
      });
    } catch (error: unknown) {
      console.error(`Error ${status}ing contract:`, error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';
      
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${status} contract: ${errorMessage}`
      });
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [farmerId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          No pending contract requests
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          New contract requests will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {contracts.map((contract) => (
        <ContractCard 
          key={contract.id} 
          contract={contract}
          onStatusUpdate={handleAcceptContract}
        />
      ))}
    </div>
  );
}
