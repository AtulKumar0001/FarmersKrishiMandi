'use client';

import React from 'react';
import Image from 'next/image';
import ContractBox from './Box';
import Link from 'next/link';
import { CloudSun } from 'lucide-react';

const MainPage = () => {
    return (
        <div className='flex flex-col items-center w-full font-sans p-6 bg-gray-100 dark:bg-gray-900 h-screen pt-0'>
            <div className='w-full max-w-4xl'>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight'>
                            Welcome, <span className='text-blue-600 dark:text-blue-400'>Rahul!</span>
                        </h1>
                        <p className='text-xl text-gray-600 dark:text-gray-300 mb-9'>Here is your crop contract status</p>
                    </div>
                    <Link href="/weather" className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center transition-colors">
                        <CloudSun className="mr-2" />
                       7 day Weather
                    </Link>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <ContractBox 
                        image={
                            <Image
                                src="/wheat.jpg" 
                                alt="Wheat"
                                width={80}
                                height={80}
                                className="object-cover rounded-lg"
                            />
                        }
                        date="28/02/2024" 
                        title="Wheat Contract" 
                        description="Price: ₹1500/qtl. Delivery due: 10/03/2024" 
                        status="In Progress" 
                    />
                    <ContractBox 
                        image={
                            <Image
                                src="/rice.jpg"
                                alt="Rice"
                                width={80}
                                height={80}
                                className="object-cover rounded-lg"
                            />
                        }
                        date="12/03/2024" 
                        title="Rice Contract" 
                        description="Price: ₹1300/qtl. Delivery due: 18/03/2024" 
                        status="Pending"
                    />
                    <ContractBox 
                        image={
                            <Image
                                src="/corn.jpg"
                                alt="Corn"
                                width={80}
                                height={80}
                                className="object-cover rounded-lg"
                            />
                        }
                        date="15/02/2024" 
                        title="Corn Contract" 
                        description="Price: ₹1200/qtl. Delivered on: 20/02/2024" 
                        status="Completed"
                    />
                    <ContractBox 
                        image={
                            <Image
                                src="/soyabean.jpg"
                                alt="Soybean"
                                width={80}
                                height={80}
                                className="object-cover rounded-lg"
                            />
                        }
                        date="20/02/2024" 
                        title="Soybean Contract" 
                        description="Price: ₹1700/qtl. Delivery due: 28/02/2024" 
                        status="In Progress" 
                    />
                </div>
            </div>
        </div>
    );
};

export default MainPage;
