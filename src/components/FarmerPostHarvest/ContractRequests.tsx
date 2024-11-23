"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Contract } from '@/types/contracts';
import ContractCard from './ContractCard';

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
        .select('id')
        .eq('user_id', farmerId)
        .single();

      if (farmerError) throw farmerError;

      // Then fetch contracts using the farmer's registration ID
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          buyer:buyer_registrations!buyer_id(
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
          onStatusUpdate={async (status) => {
            const supabase = createClient();
            
            if (status === 'accepted') {
              const farmerOtp = Math.random().toString(36).slice(-6).toUpperCase();
              const buyerOtp = Math.random().toString(36).slice(-6).toUpperCase();

              // First update the contract status
              const { error: contractError } = await supabase
                .from('contracts')
                .update({ status })
                .eq('id', contract.id);

              if (contractError) {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: `Failed to ${status} contract`
                });
                return;
              }

              // Then create entry in accepted_post_harvest_contracts
              const { error: acceptedError } = await supabase
                .from('accepted_post_harvest_contracts')
                .insert([{
                  contract_id: contract.id,
                  farmer_otp: farmerOtp,
                  buyer_otp: buyerOtp,
                }]);

              if (acceptedError) {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "Failed to create accepted contract entry"
                });
                return;
              }
            } else {
              // If rejecting, just update the contract status
              const { error } = await supabase
                .from('contracts')
                .update({ status })
                .eq('id', contract.id);

              if (error) {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: `Failed to ${status} contract`
                });
                return;
              }
            }

            setContracts(contracts.filter(c => c.id !== contract.id));
            toast({
              title: "Success",
              description: `Contract ${status} successfully`
            });
          }}
        />
      ))}
    </div>
  );
}
