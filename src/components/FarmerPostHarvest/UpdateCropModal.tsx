'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Crop } from '@/types/crop';

interface UpdateCropModalProps {
  crop: Crop;
  onClose: () => void;
  onUpdate: (updatedCrop: Crop) => void;
}

export default function UpdateCropModal({ crop, onClose, onUpdate }: UpdateCropModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    crop_name: crop.crop_name,
    quantity: crop.quantity.toString(),
    expected_price: crop.expected_price.toString(),
    description: crop.description || '',
    phone_number: crop.phone_number || '',
  });

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const supabase = createClient();
      
      const { error } = await supabase
        .from('post_harvest_crops')
        .update({
          crop_name: formData.crop_name,
          quantity: parseFloat(formData.quantity),
          expected_price: parseFloat(formData.expected_price),
          description: formData.description,
          phone_number: formData.phone_number,
        })
        .eq('id', crop.id);

      if (error) throw error;

      const updatedCrop = {
        ...crop,
        ...formData,
        quantity: parseFloat(formData.quantity),
        expected_price: parseFloat(formData.expected_price),
      };

      onUpdate(updatedCrop);
      onClose();
      
      toast({
        title: "Success",
        description: "Crop details updated successfully!"
      });
    } catch (error) {
      console.error('Error updating crop:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update crop details"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm z-50">
      <div className="fixed inset-0 overflow-y-auto pt-20">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div 
            ref={modalRef}
            className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4"
          >
            <div className="bg-emerald-500 flex justify-between items-center p-4">
              <h2 className="text-2xl font-bold text-white">Update Crop Details</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Crop Name
                  </label>
                  <input
                    type="text"
                    value={formData.crop_name}
                    onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expected Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.expected_price}
                    onChange={(e) => setFormData({ ...formData, expected_price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    pattern="[0-9]{10}"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Updating...' : 'Update Crop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}