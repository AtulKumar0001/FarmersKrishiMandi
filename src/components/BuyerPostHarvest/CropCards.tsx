'use client';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import CropCard from './CropCard';
import { Crop } from '@/types/crop';

interface CropCardsProps {
  initialCrops: Crop[];
}

const CropCards = ({ initialCrops }: CropCardsProps) => {
  console.log(initialCrops)
  const [crops] = useState(initialCrops);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {crops.map((crop) => (
        <CropCard key={crop.id} crop={crop} />
      ))}
      <div ref={ref}>
        {inView && crops.length >= 10 && (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropCards;