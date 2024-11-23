"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Contract } from '@/types/contracts';
import ContractCard from './ContractCard';
import { ethers, BrowserProvider } from "ethers";

const FACTORY_ADDRESS = "0x302275981fa3C4ab7F3D3dE8AEb16721351E8Ca1";
const FACTORY_ABI = [
  "function createContract(string memory _buyerId, string memory _farmerId, uint256 _setPrice, string memory _cropType, uint256 _quantity, uint256 _duration, string memory _buyerSecret, string memory _farmerSecret) public returns (address)",
  "function getDeployedContracts() public view returns (address[])",
  "function getFarmerContracts(string memory _farmerId) public view returns (address[])",
  "function getBuyerContracts(string memory _buyerId) public view returns (address[])",
  "event ContractDeployed(address indexed contractAddress, string indexed buyerId, string indexed farmerId, uint256 timestamp)"
];

const CONTRACT_ABI = [
  "function initialize(string memory _buyerId, string memory _farmerId, uint256 _setPrice, string memory _cropType, uint256 _quantity, uint256 _duration, string memory _buyerSecret, string memory _farmerSecret) public",
  "function getContractStatus() public view returns (string memory status, bool buyerVerified, bool farmerVerified, uint256 remainingTime)",
  "function verifyBuyerSecret(string memory _secret) public",
  "function verifyFarmerSecret(string memory _secret) public",
  "function getContractDetails() public view returns (string memory buyerId, string memory farmerId, uint256 setPrice, string memory cropType, uint256 quantity, uint256 duration, uint256 createdAt)"
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

  const handleAcceptContract = async (contract: Contract) => {
    try {
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
        ethers.parseEther(contract.price.toString()),
        contract.crop_name,
        contract.quantity,
        30 * 24 * 60 * 60,
        buyerOtp,
        farmerOtp
      );

      // Wait for transaction and get receipt
      const receipt = await tx.wait();
      
      // Get deployed contract address from event
      const deployEvent = receipt.logs.find(
        (log: any) => log.eventName === "ContractDeployed"
      );
      const deployedAddress = deployEvent.args[0];

      // Store in Supabase
      const supabase = createClient();
      await supabase
        .from('accepted_post_harvest_contracts')
        .insert([{
          contract_id: contract.id,
          farmer_otp: farmerOtp,
          buyer_otp: buyerOtp,
          block_no: deployedAddress,
        }]);

      // Update contract status
      await supabase
        .from('contracts')
        .update({ status: 'accepted' })
        .eq('id', contract.id);

      setContracts(contracts.filter(c => c.id !== contract.id));
      toast({
        title: "Success",
        description: "Contract accepted successfully"
      });
    } catch (error) {
      console.error('Error accepting contract:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept contract"
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
