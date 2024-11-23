"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Contract } from '@/types/contracts';
import ContractCard from './ContractCard';
import { ethers, BrowserProvider } from "ethers";


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

  const getContractDetails = async (contractAddress: string) => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not detected");
      }
      
      const provider = new BrowserProvider(window.ethereum);
      const abi = [
        "function contractDetails() public view returns (string, string, uint256, string, uint256, uint256, string, uint256)"
      ];
      
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const details = await contract.contractDetails();
      
      console.log("Contract Details:", {
        buyerId: details[0],
        farmerId: details[1],
        price: ethers.formatEther(details[2]),
        cropType: details[3],
        quantity: details[4].toString(),
        duration: details[5].toString(),
        status: details[6],
        createdAt: new Date(Number(details[7]) * 1000)
      });
      
      return details;
    } catch (error) {
      console.error("Error fetching contract details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch contract details"
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
          onStatusUpdate={async (status: 'accepted' | 'rejected') => {
            try {
              const supabase = createClient();
              
              if (status === 'accepted') {
                // Generate OTPs
                const buyerOtp = Math.random().toString(36).slice(-6).toUpperCase();
                const farmerOtp = Math.random().toString(36).slice(-6).toUpperCase();

                // Connect to Ethereum
                if (!window.ethereum) {
                  throw new Error("MetaMask not detected. Please install MetaMask.");
                }

                // Connect to Ethereum
                const provider = new BrowserProvider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();

                // Smart contract interaction
                const contractAddress = "0xb590837f0A140804C748868DB44b633d60c11e66";
                const abi = [
                  "function initializeContract(string memory _buyerId, string memory _farmerId, uint256 _setPrice, string memory _cropType, uint256 _quantity, uint256 _duration, string memory _buyerSecret, string memory _farmerSecret) public",
                  "event ContractCreated(string message)"
                ];
                const smartContract = new ethers.Contract(contractAddress, abi, signer);

                // Add event listener for ContractCreated event
                smartContract.on("ContractCreated", (message: string) => {
                  console.log("Contract Created Event:", message);
                });

                // Deploy to blockchain
                const { data: farmerData, error: farmerError } = await supabase
                  .from('farmer_registrations')
                  .select('id, user_id')
                  .eq('user_id', farmerId)
                  .single();

                if (farmerError) throw farmerError;

                if (!contract.buyer) {
                  throw new Error("Buyer information not found");
                }
                const tx = await smartContract.initializeContract(
                  contract.buyer.user_id,
                  farmerData.user_id,
                  ethers.parseEther(contract.price.toString()),
                  contract.crop_name,
                  contract.quantity,
                  30 * 24 * 60 * 60,
                  buyerOtp,
                  farmerOtp
                );

                // Wait for transaction and get receipt
                const receipt = await tx.wait();
                console.log("Transaction Hash:", receipt.hash);
                const details = await getContractDetails(contractAddress);
                console.log("Saved Contract Details:", details);

                // Store transaction hash in accepted_post_harvest_contracts
                await supabase
                  .from('accepted_post_harvest_contracts')
                  .insert([{
                    contract_id: contract.id,
                    farmer_otp: farmerOtp,
                    buyer_otp: buyerOtp,
                    block_no: receipt.blockNumber.toString(), // Add block number
                  }]);

                // Update Supabase
                await supabase
                  .from('contracts')
                  .update({ status })
                  .eq('id', contract.id);
              } else {
                // Just update status for rejection
                await supabase
                  .from('contracts')
                  .update({ status })
                  .eq('id', contract.id);
              }

              setContracts(contracts.filter(c => c.id !== contract.id));
              toast({
                title: "Success",
                description: `Contract ${status} successfully`
              });
            } catch (error) {
              console.log(error,status)
              console.error(`Error ${status}ing contract:`, error);
              toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to ${status} contract`
              });
            }
          }}
        />
      ))}
    </div>
  );
}
