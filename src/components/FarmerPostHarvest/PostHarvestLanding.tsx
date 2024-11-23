"use client"
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import PostHarvestForm from "./PostHarvestForm";
import { useToast } from "@/hooks/use-toast";
import PostedCrops from "./PostedCrops";
import { Crop } from '@/types/crop';
import ContractRequests from "./ContractRequests";

export default function PostHarvestLanding({farmerId}:{farmerId:string}) {
    const [activeTab, setActiveTab] = useState('crops');
    const [showAddCropModal, setShowAddCropModal] = useState(false);
    const [farmerData, setFarmerData] = useState(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchFarmerData = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("farmer_registrations")
                .select("*")
                .eq("user_id", farmerId)
                .single();

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch farmer details"
                });
                return;
            }
            setFarmerData(data);
        };

        fetchFarmerData();
    }, [farmerId]);

    const handleCropAdded = (newCrop: Crop) => {
        setShowAddCropModal(false);
        const postedCropsComponent = document.getElementById('posted-crops');
        if (postedCropsComponent) {
            const event = new CustomEvent('cropAdded', { 
                detail: newCrop,
                bubbles: true 
            });
            postedCropsComponent.dispatchEvent(event);
        }
        toast({
            title: "Success",
            description: "Crop added successfully!"
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                    <option value="contracts">Contract Requests</option>
                    <option value="crops">Posted Crops</option>
                </select>

                <button
                    onClick={() => setShowAddCropModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New Crop</span>
                </button>
            </div>

            <div className="mt-6">
                {activeTab === 'contracts' ? (
                    <ContractRequests farmerId={farmerId} /> 
                 ) : ( 
                    <div id="posted-crops">
                        <PostedCrops farmerId={farmerId} />
                    </div>
                )} 
            </div>

            {showAddCropModal && farmerData && (
                <PostHarvestForm 
                    farmerId={farmerId} 
                    farmerData={farmerData}
                    onSuccess={handleCropAdded}
                    onClose={() => setShowAddCropModal(false)}
                />
            )}
        </div>
    );
}