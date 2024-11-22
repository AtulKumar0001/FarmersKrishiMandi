import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { Contracts } from "@/types/contracts";

interface MaximizedContractProps {
  contracts: Contracts[];
  onClose: () => void;
  title: string;
  theme: 'green' | 'red' | 'blue' | 'yellow';
}

export default function MaximizedContract({ contracts, onClose, title, theme }: MaximizedContractProps) {
  const [displayedContracts, setDisplayedContracts] = useState<Contracts[]>([]);
  const [page, setPage] = useState(1);
  const loader = useRef(null);
  const CONTRACTS_PER_PAGE = 10;

  const loadMoreContracts = useCallback(() => {
    const startIndex = (page - 1) * CONTRACTS_PER_PAGE;
    const endIndex = startIndex + CONTRACTS_PER_PAGE;
    const newContracts = contracts.slice(startIndex, endIndex);
    setDisplayedContracts(prev => [...prev, ...newContracts]);
    setPage(prev => prev + 1);
  }, [contracts, page]);

  useEffect(() => {
    loadMoreContracts();
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && displayedContracts.length < contracts.length) {
        loadMoreContracts();
      }
    }, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loadMoreContracts, displayedContracts.length, contracts.length]);

  const themeColors = {
    green: 'bg-green-500 text-green-50',
    red: 'bg-red-500 text-red-50',
    blue: 'bg-blue-500 text-blue-50',
    yellow: 'bg-yellow-500 text-yellow-50'
  };

  return (
    <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl h-[80vh] rounded-lg shadow-2xl overflow-hidden flex flex-col mt-16">
        <div className={`flex justify-between items-center p-4 ${themeColors[theme]}`}>
          <h1 className="text-2xl font-bold">{title}</h1>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {displayedContracts.map((contract) => (
            <div
              key={contract.id}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{contract.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">Amount: ₹{contract.amount.toLocaleString()}</p>
              {theme === 'green' && contract.completionDate && (
                <p className="text-gray-600 dark:text-gray-300">Completed on: {contract.completionDate}</p>
              )}
              {theme === 'red' && contract.completionDate && (
                <p className="text-gray-600 dark:text-gray-300">Cancelled on: {contract.completionDate}</p>
              )}
              {theme === 'blue' && (
                <>
                  {contract.startDate && (
                    <p className="text-gray-600 dark:text-gray-300">Started on: {contract.startDate}</p>
                  )}
                  {contract.expectedCompletionDate && (
                    <p className="text-gray-600 dark:text-gray-300">Expected completion: {contract.expectedCompletionDate}</p>
                  )}
                </>
              )}
              {theme === 'yellow' && (
                <p className="text-gray-600 dark:text-gray-300">Pending approval</p>
              )}
            </div>
          ))}
          {displayedContracts.length < contracts.length && (
            <div ref={loader} className="h-10 flex items-center justify-center">
              <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${themeColors[theme].split(' ')[0].replace('bg-', 'border-')}`}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
