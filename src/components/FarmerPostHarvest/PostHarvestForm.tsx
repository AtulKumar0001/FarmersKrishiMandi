"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardHeader, CardContent } from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import { Crop } from '@/types/crop';

interface FarmerData {
  name: string;
  address: string;
  pincode: string;
  state: string;
}

interface PostHarvestFormProps {
    farmerId: string;
    farmerData: FarmerData;
    onSuccess: (data: Crop) => void;
    onClose: () => void;
}

export default function PostHarvestForm({ 
    farmerId, 
    farmerData, 
    onSuccess, 
    onClose 
}: PostHarvestFormProps) {
  const { toast } = useToast();
  const [cropDetails, setCropDetails] = useState({
    crop_name: "",
    quantity: "",
    expected_price: "",
    phone_number:"",
    description: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("post_harvest_crops")
        .insert([
          {
            farmer_id: farmerId,
            ...cropDetails,
            farmer_name: farmerData.name,
            farmer_address: farmerData.address,
            farmer_pincode: farmerData.pincode,
            farmer_city: farmerData.state,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Crop details submitted successfully!"
      });

      onSuccess(data);
      onClose();

    } catch (error) {
      console.error("Error submitting crop details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit crop details"
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!farmerData) {
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">No farmer details found</h2>
              <p className="text-muted-foreground mt-2">
                Please complete your registration first.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 overflow-y-auto">
      <div className="min-h-screen px-4 pt-24 pb-8">
        <Card className="max-w-2xl mx-auto relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <CardHeader>
            <h2 className="text-2xl font-bold">Post Harvest Crop Details</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Farmer Details Section */}
            <Card className="border bg-muted/40">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Farmer Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium">{farmerData.name}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">State</Label>
                    <p className="font-medium">{farmerData.state}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Address</Label>
                    <p className="font-medium">{farmerData.address}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Pincode</Label>
                    <p className="font-medium">{farmerData.pincode}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crop Details Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="crop_name">Crop Name</Label>
                <Input
                  id="crop_name"
                  placeholder="Enter crop name"
                  value={cropDetails.crop_name}
                  onChange={(e) =>
                    setCropDetails({ ...cropDetails, crop_name: e.target.value })
                  }
                  className="bg-background"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (in kg)</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={cropDetails.quantity}
                  onChange={(e) =>
                    setCropDetails({ ...cropDetails, quantity: e.target.value })
                  }
                  className="bg-background"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_price">Expected Price (per kg)</Label>
                <Input
                  id="expected_price"
                  type="number"
                  placeholder="Enter expected price"
                  value={cropDetails.expected_price}
                  onChange={(e) =>
                    setCropDetails({
                      ...cropDetails,
                      expected_price: e.target.value,
                    })
                  }
                  className="bg-background"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Your Phone Number</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  placeholder="0123456789"
                  value={cropDetails.phone_number}
                  onChange={(e) =>
                    setCropDetails({
                      ...cropDetails,
                      phone_number: e.target.value,
                    })
                  }
                  pattern="[0-9]{10}"
                  className="bg-background"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  placeholder="Enter crop description"
                  className="w-full min-h-[100px] p-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={cropDetails.description}
                  onChange={(e) =>
                    setCropDetails({
                      ...cropDetails,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Crop Details"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
