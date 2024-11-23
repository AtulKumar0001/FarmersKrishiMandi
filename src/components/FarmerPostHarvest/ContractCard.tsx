'use client';
import { useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { Contract } from '@/types/contracts';

interface ContractCardProps {
  contract: Contract;
  onStatusUpdate: (contract: Contract) => Promise<void>;
}

export default function ContractCard({ contract, onStatusUpdate }: ContractCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (status: 'accepted' | 'rejected') => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      await onStatusUpdate(contract);
    } catch (error) {
      console.error(`Failed to ${status} contract:`, error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`cursor-pointer transition-all duration-300 transform ${
        isExpanded ? 'col-span-full' : 'h-full'
      } ${isHovered ? 'scale-105' : ''}`}
    >
      <div className="relative h-full overflow-hidden rounded-lg group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="h-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 flex flex-col">
          {!isExpanded ? (
            <div className="flex flex-col h-full justify-between space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-4">
                  {contract.type === 'post_harvest' ? 'Post Harvest Contract' : 
                   contract.type === 'pre_sowing' ? 'Pre Sowing Contract' : 'Land Lease Contract'}
                </h3>
                <div className="text-gray-600 dark:text-gray-300 space-y-2">
                  <p className="transition-transform duration-200 hover:translate-x-1">
                    <span className="font-medium">Buyer:</span> {contract.buyer?.name}
                  </p>
                  <p className="transition-transform duration-200 hover:translate-x-1">
                    <span className="font-medium">Price:</span> {formatPrice(contract.price)}
                  </p>
                  <p className="transition-transform duration-200 hover:translate-x-1">
                    <span className="font-medium">Delivery Date:</span> {new Date(contract.delivery_date).toLocaleDateString('en-IN')}
                  </p>
                  
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                Click to view more details
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                Contract Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600 dark:text-gray-300">
                <div className="space-y-2">
                  <p className="font-semibold text-lg">Buyer Details:</p>
                  <p className="transition-transform duration-200 hover:translate-x-1">
                    Name: {contract.buyer?.name}
                  </p>
                  <p className="transition-transform duration-200 hover:translate-x-1">
                    Phone: {contract.buyer?.phone_number}
                  </p>
                  <p className="transition-transform duration-200 hover:translate-x-1">
                    Address: {contract.buyer?.address}
                  </p>
                  <p className="transition-transform duration-200 hover:translate-x-1">
                    State: {contract.buyer?.state}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-lg">Contract Details:</p>
                  <p className="transition-transform duration-200 hover:translate-x-1">
                    Type: {contract.type}
                  </p>
                  <p className="transition-transform duration-200 hover:translate-x-1">
                    Price: {formatPrice(contract.price)}
                  </p>
                  <p className="transition-transform duration-200 hover:translate-x-1">
                    Delivery Date: {new Date(contract.delivery_date).toLocaleDateString('en-IN')}
                  </p>
                  <p className="transition-transform duration-200 hover:translate-x-1">
                    Crop Name: {contract.crop_name}
                  </p>
                  <p className="transition-transform duration-200 hover:translate-x-1">
                    Quantity: {contract.quantity}
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusUpdate('accepted');
                  }}
                  disabled={isUpdating}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  <span>{isUpdating ? 'Accepting...' : 'Accept Contract'}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusUpdate('rejected');
                  }}
                  disabled={isUpdating}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                  <span>{isUpdating ? 'Rejecting...' : 'Reject Contract'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </div>
  );
}