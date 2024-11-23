'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PostedCropCard from './PostedCropCard';
import { Crop } from '@/types/crop';

export default function PostedCrops({ farmerId }: { farmerId: string }) {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCrops = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('post_harvest_crops')
        .select('*')
        .eq('farmer_id', farmerId);

      if (error) throw error;
      setCrops(data || []);
    } catch (error) {
      console.error('Error fetching crops:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch your posted crops"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
    
    const postedCropsElement = document.getElementById('posted-crops');
    if (postedCropsElement) {
        const handleCropAdded = (event: CustomEvent<Crop>) => {
            setCrops(prevCrops => [...prevCrops, event.detail]);
        };
        
        postedCropsElement.addEventListener('cropAdded', handleCropAdded as EventListener);
        return () => {
            postedCropsElement.removeEventListener('cropAdded', handleCropAdded as EventListener);
        };
    }
  }, [farmerId]);

//   const handleCropAdded = (newCrop: Crop) => {
//     setCrops(prevCrops => [...prevCrops, newCrop]);
//     fetchCrops();
//   };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (crops.length === 0) {
    return (
      <div className="relative">
        <div className="text-center py-8 pointer-events-none">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            No crops posted yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Add your first crop using the button above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {crops.map((crop) => (
        <PostedCropCard 
          key={crop.id} 
          crop={crop}
          onDelete={(id) => {
            setCrops(crops.filter(c => c.id !== id));
            toast({
              title: "Success",
              description: "Crop deleted successfully"
            });
          }}
          onUpdate={(updatedCrop) => {
            setCrops(crops.map(c => c.id === updatedCrop.id ? updatedCrop : c));
            toast({
              title: "Success",
              description: "Crop updated successfully"
            });
          }}
        />
      ))}
    </div>
  );
}