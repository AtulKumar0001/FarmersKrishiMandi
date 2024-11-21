'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { Crop } from '@/types/crop';
import UpdateCropModal from './UpdateCropModal';

interface PostedCropCardProps {
  crop: Crop;
  onDelete: (id: string) => void;
  onUpdate: (crop: Crop) => void;
}

export default function PostedCropCard({ crop, onDelete, onUpdate }: PostedCropCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const supabase = createClient();
      const { error } = await supabase
        .from('post_harvest_crops')
        .delete()
        .eq('id', crop.id);

      if (error) throw error;
      onDelete(crop.id);
    } catch (error) {
      console.error('Error deleting crop:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete crop"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedPrice = formatPrice(crop.expected_price);

  return (
    <>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`cursor-pointer transition-all duration-300 transform ${
          isExpanded ? 'col-span-full' : 'h-full'
        } ${isHovered ? 'scale-105' : ''}`}
      >
        <div className="relative h-full overflow-hidden rounded-lg group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="h-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 flex flex-col">
            {!isExpanded ? (
              <div className="flex flex-col h-full justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 mb-4">
                    {crop.crop_name}
                  </h3>
                  <div className="text-gray-600 dark:text-gray-300 space-y-2">
                    <p className="transition-transform duration-200 hover:translate-x-1">
                      <span className="font-medium">Quantity:</span> {crop.quantity} kg
                    </p>
                    <p className="transition-transform duration-200 hover:translate-x-1">
                      <span className="font-medium">Expected Price:</span> {formattedPrice}
                    </p>
                    <p className="transition-transform duration-200 hover:translate-x-1">
                      <span className="font-medium">Location:</span> {crop.farmer_city}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Click to view more details
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                  {crop.crop_name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600 dark:text-gray-300">
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">Contact Details:</p>
                    <p className="transition-transform duration-200 hover:translate-x-1">
                      Phone: {crop.phone_number}
                    </p>
                    <p className="transition-transform duration-200 hover:translate-x-1">
                      Address: {crop.farmer_address}
                    </p>
                    <p className="transition-transform duration-200 hover:translate-x-1">
                      Pincode: {crop.farmer_pincode}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">Crop Details:</p>
                    <p className="transition-transform duration-200 hover:translate-x-1">
                      Quantity: {crop.quantity} kg
                    </p>
                    <p className="transition-transform duration-200 hover:translate-x-1">
                      Expected Price: {formattedPrice}
                    </p>
                    <p className="transition-transform duration-200 hover:translate-x-1">
                      Description: {crop.description || 'No description provided'}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUpdateModal(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Update</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
      </div>

      {showUpdateModal && (
        <UpdateCropModal
          crop={crop}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}