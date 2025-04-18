"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Contract } from '@/types/contracts';
import ContractCard from './ContractCard';
import { ethers, BrowserProvider, Log } from "ethers";



const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYED_BLOCKCHAIN_FACTORY_CONTRACT_ADDRESS as string;
// Ensure this environment variable is set in your .env file
if (!FACTORY_ADDRESS) {
  throw new Error("Please set the NEXT_PUBLIC_DEPLOYED_BLOCKCHAIN_FACTORY_CONTRACT_ADDRESS environment variable");
}
// Ensure this environment variable is set in your .env file
if (!process.env.NEXT_PUBLIC_DEPLOYED_BLOCKCHAIN_FACTORY_CONTRACT_ADDRESS) {
  throw new Error("Please set the NEXT_PUBLIC_DEPLOYED_BLOCKCHAIN_FACTORY_CONTRACT_ADDRESS environment variable");
}
const FACTORY_ABI = [
  "function createContract(string memory _buyerId, string memory _farmerId, uint256 _setPrice, string memory _cropType, uint256 _quantity, uint256 _duration, string memory _buyerSecret, string memory _farmerSecret) public returns (address)",
  "function getDeployedContracts() public view returns (address[])",
  "function getFarmerContracts(string memory _farmerId) public view returns (address[])",
  "function getBuyerContracts(string memory _buyerId) public view returns (address[])",
  "event ContractDeployed(address indexed contractAddress, string indexed buyerId, string indexed farmerId, uint256 timestamp)"
];

// const CONTRACT_ABI = [
//   "function initialize(string memory _buyerId, string memory _farmerId, uint256 _setPrice, string memory _cropType, uint256 _quantity, uint256 _duration, string memory _buyerSecret, string memory _farmerSecret) public",
//   "function getContractStatus() public view returns (string memory status, bool buyerVerified, bool farmerVerified, uint256 remainingTime)",
//   "function verifyBuyerSecret(string memory _secret) public",
//   "function verifyFarmerSecret(string memory _secret) public",
//   "function getContractDetails() public view returns (string memory buyerId, string memory farmerId, uint256 setPrice, string memory cropType, uint256 quantity, uint256 duration, uint256 createdAt)"
// ];

// Add interface for the contract event
// interface ContractDeployedEvent {
//   args: [string, string, string, bigint]; // [contractAddress, buyerId, farmerId, timestamp]
// }

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
    } catch (error) {
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

        // Create factory contract instance
        const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

        // Generate OTPs
        const buyerOtp = Math.random().toString(36).slice(-6).toUpperCase();
        const farmerOtp = Math.random().toString(36).slice(-6).toUpperCase();

        // Deploy new contract through factory
        const tx = await factory.createContract(
          contract.buyer.user_id,
          farmerId,
          ethers.parseEther(Number(contract.price).toFixed(18)),
          contract.crop_name,
          contract.quantity,
          30 * 24 * 60 * 60,
          buyerOtp,
          farmerOtp
        );

        const receipt = await tx.wait();
        console.log(receipt);
        
        // Find the ContractDeployed event in the logs
        const deployEvent = receipt.logs.find(
          (log: Log) => {
            try {
              const parsedLog = factory.interface.parseLog({
                topics: log.topics as string[],
                data: log.data,
              });
              return parsedLog?.name === "ContractDeployed";
            } catch {
              return false;
            }
          }
        );

        if (!deployEvent) {
          throw new Error("Contract deployment event not found");
        }

        const parsedEvent = factory.interface.parseLog({
          topics: deployEvent.topics as string[],
          data: deployEvent.data,
        });

        const deployedAddress = parsedEvent?.args[0];
        if (!deployedAddress) {
          throw new Error("Deployed address not found in event");
        }

        // Store in ongoing_post_harvest_contracts
        await supabase
          .from('ongoing_post_harvest_contracts')
          .insert([{
            contract_id: contract.id,
            farmer_otp: farmerOtp,
            buyer_otp: buyerOtp,
            contract_address: deployedAddress,
            block_no: receipt.blockNumber.toString(), // Add block number
          }]);
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
      }

      // Update contract status
      await supabase
        .from('contracts')
        .update({ status })
        .eq('id', contract.id);

      setContracts(contracts.filter(c => c.id !== contract.id));
      toast({
        title: "Success",
        description: `Contract ${status} successfully`
      });
    } catch (error) {
      console.error(`Error ${status}ing contract:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${status} contract`
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
