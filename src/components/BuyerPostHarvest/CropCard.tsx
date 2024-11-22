'use client';
import { useState, useEffect } from 'react';
import ContactModal from './ContactModal';
import ContractForm from './ContractForm';
import { formatPrice } from '@/lib/utils';
import { Crop, ContractData } from '@/types/crop';

interface CropCardProps {
  crop: Crop;
}

const CropCard = ({ crop }: CropCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);
  const [hasSubmittedContract, setHasSubmittedContract] = useState(false);

  useEffect(() => {
    // Check localStorage for submitted contracts
    const submittedContracts = JSON.parse(localStorage.getItem('submittedContracts') || '{}');
    if (submittedContracts[crop.id]) {
      setHasSubmittedContract(true);
    }
  }, [crop.id]);

  const handleContractSubmit = async (contractData: ContractData) => {
    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contractData,
          crop_id: crop.id,
        }),
      });
      console.log(response)
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit contract');
      }

      // Update localStorage after successful submission
      const submittedContracts = JSON.parse(localStorage.getItem('submittedContracts') || '{}');
      submittedContracts[crop.id] = true;
      localStorage.setItem('submittedContracts', JSON.stringify(submittedContracts));
      
      setHasSubmittedContract(true);
      setShowContractForm(false);
    } catch (error) {
      console.error('Error:', error);
      const message = error instanceof Error ? error.message : 'Failed to submit contract. Please try again.';
      alert(message);
      throw error;
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
              // Minimized View
              <div className="flex flex-col h-full justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 mb-4">
                    {crop.crop_name}
                  </h3>
                  <div className="text-gray-600 dark:text-gray-300 space-y-2">
                    <p className="transition-transform duration-200 hover:translate-x-1">
                      <span className="font-medium">Farmer:</span> {crop.farmer_name}
                    </p>
                    <p className="transition-transform duration-200 hover:translate-x-1">
                      <span className="font-medium">Location:</span> {crop.farmer_city}
                    </p>
                    <p className="transition-transform duration-200 hover:translate-x-1">
                      <span className="font-medium">Expected Price:</span> {formattedPrice}
                    </p>
                    <p className="transition-transform duration-200 hover:translate-x-1">
                      <span className="font-medium">Quantity:</span> {crop.quantity} kg
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Click to view more details
                </div>
              </div>
            ) : (
              // Expanded View
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                  {crop.crop_name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600 dark:text-gray-300">
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">Farmer Details:</p>
                    <p className="transition-transform duration-200 hover:translate-x-1">Name: {crop.farmer_name}</p>
                    <p className="transition-transform duration-200 hover:translate-x-1">Address: {crop.farmer_address}</p>
                    <p className="transition-transform duration-200 hover:translate-x-1">City: {crop.farmer_city}</p>
                    <p className="transition-transform duration-200 hover:translate-x-1">Pincode: {crop.farmer_pincode}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">Crop Details:</p>
                    <p className="transition-transform duration-200 hover:translate-x-1">Quantity: {crop.quantity} kg</p>
                    <p className="transition-transform duration-200 hover:translate-x-1">Expected Price: {formattedPrice}</p>
                    <p className="transition-transform duration-200 hover:translate-x-1">Description: {crop.description}</p>
                    <p className="transition-transform duration-200 hover:translate-x-1">Crop Name: {crop.crop_name}</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <button 
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowContactModal(true);
                    }}
                  >
                    Contact Farmer
                  </button>
                  <button 
                    className={`px-4 py-2 ${
                      hasSubmittedContract 
                        ? 'bg-gray-500 cursor-not-allowed opacity-50' 
                        : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
                    } text-white rounded-lg transition-all duration-300 transform hover:shadow-lg`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!hasSubmittedContract) {
                        setShowContractForm(true);
                      }
                    }}
                    disabled={hasSubmittedContract}
                    aria-disabled={hasSubmittedContract}
                  >
                    {hasSubmittedContract ? 'Contract Submitted' : 'Create Contract'}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
      </div>

      {showContactModal && (
        <ContactModal
          farmer={crop}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {showContractForm && (
        <ContractForm
          crop={crop}
          onClose={() => setShowContractForm(false)}
          onSubmit={handleContractSubmit}
        />
      )}
    </>
  );
};

export default CropCard;