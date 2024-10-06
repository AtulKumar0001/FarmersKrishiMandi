'use client';

import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
interface ContractBoxProps {
    image: React.ReactNode;
    date: string;
    title: string;
    description: string;
    status: 'Completed' | 'In Progress' | 'Pending';
  }

  const ContractBox: React.FC<ContractBoxProps> = ({ image, date, title, description, status }) => {
    // Status configuration
    const statusConfig = {
        'Completed': { color: 'text-green-600 dark:text-green-400', icon: <CheckCircle className="text-green-600 dark:text-green-400" /> },
        'In Progress': { color: 'text-yellow-600 dark:text-yellow-400', icon: <Clock className="text-yellow-600 dark:text-yellow-400" /> },
        'Pending': { color: 'text-red-600 dark:text-red-400', icon: <AlertCircle className="text-red-600 dark:text-red-400" /> }
    };

    const { color, icon: statusIcon } = statusConfig[status] || statusConfig['Pending'];

    return (
        <div className='bg-white dark:bg-gray-800 p-6 rounded-xl text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:cursor-pointer transition-all duration-300 shadow-lg'>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="mr-4">
                        {image}
                    </div>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>{title}</h2>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Contract Date: {date}</p>
                    </div>
                </div>
                <div className={`flex items-center ${color}`}>
                    {statusIcon}
                    <span className='ml-2 font-semibold'>{status}</span>
                </div>
            </div>
            <p className='text-gray-700 dark:text-gray-300 mt-2'>{description}</p>
        </div>
    );
};

export default ContractBox;