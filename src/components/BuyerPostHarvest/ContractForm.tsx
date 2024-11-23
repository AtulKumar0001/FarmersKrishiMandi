'use client';
import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Crop, ContractData } from '@/types/crop';

interface ContractFormProps {
  crop: Crop;
  onClose: () => void;
  onSubmit: (contractData: ContractData) => Promise<void>;
}

type ContractType = 'land_lease' | 'pre_sowing' | 'post_harvest';
// type ContractStatus = 'pending' | 'accepted' | 'rejected';

const ContractForm = ({ crop, onClose, onSubmit }: ContractFormProps) => {
  const formRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<ContractData, 'farmer_id'>>({
    type: 'post_harvest',
    price: crop.expected_price,
    crop_name: crop.crop_name,
    quantity: crop.quantity,
    delivery_date: '',
    status: 'pending',
    // block_no:null,
    // buyer_otp:null,
    // farmer_otp:null,
    delivery_status:'pending'
  });

  const minDate = new Date().toISOString().split('T')[0];
  const formattedPrice = formatPrice(crop.expected_price);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...formData,
        farmer_id: crop.farmer_id,
      });
      const submittedContracts = JSON.parse(localStorage.getItem('submittedContracts') || '{}');
      submittedContracts[crop.id] = true;
      localStorage.setItem('submittedContracts', JSON.stringify(submittedContracts));
      onClose();
    } catch (error) {
      console.error('Error submitting contract:', error);
      alert('Failed to submit contract. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as ContractType;
    setFormData({ ...formData, type: newType });
  };

  return (
    <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm z-50">
      <div className="fixed inset-0 overflow-y-auto pt-20">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div 
            ref={formRef}
            className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4"
          >
            <div className="bg-emerald-500 flex justify-between items-center p-4">
              <h2 className="text-2xl font-bold text-white">Create Contract</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                {isSubmitting ? "" : <X className="w-6 h-6 text-white" />}
              </button>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Crop Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Farmer:</span> {crop.farmer_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Crop:</span> {crop.crop_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Quantity:</span> {crop.quantity} kg
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Expected Price:</span> {formattedPrice}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contract Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={handleTypeChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 text-sm"
                      required
                    >
                      <option value="land_lease">Land Lease</option>
                      <option value="pre_sowing">Pre-Sowing</option>
                      <option value="post_harvest">Post-Harvest</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Offered Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 text-sm"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Delivery Date
                    </label>
                    <input
                      type="date"
                      value={formData.delivery_date}
                      onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 text-sm"
                      min={minDate}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Contract'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractForm;