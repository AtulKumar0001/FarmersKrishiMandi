'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sun, Cloud, CloudRain, CloudSnow, Thermometer } from 'lucide-react';

const WeatherForecast = () => {
    // Mock data for the 7-day forecast (reduced from 15 for simplicity)
    const forecast = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        temp: Math.floor(Math.random() * (35 - 20 + 1) + 20),
        condition: ['sunny', 'cloudy', 'rainy', 'snowy'][Math.floor(Math.random() * 4)]
    }));

    // Function to get the weather icon based on the condition
    const getWeatherIcon = (condition: string) => {
        switch (condition) {
            case 'sunny': return <Sun size={48} className="text-yellow-400" />;
            case 'cloudy': return <Cloud size={48} className="text-gray-400" />;
            case 'rainy': return <CloudRain size={48} className="text-blue-400" />;
            case 'snowy': return <CloudSnow size={48} className="text-blue-200" />;
            default: return <Sun size={48} className="text-yellow-400" />;
        }
    };

    return (
        <div className='flex flex-col items-center w-full font-sans p-4  min-h-screen'>
            <div className='w-full max-w-3xl'>
                <Link href="/" className="text-white hover:text-gray-200 flex items-center mb-6 text-lg">
                    <ArrowLeft className="mr-2" />
                    Back to Home
                </Link>
                <h1 className='text-4xl font-bold text-yellow-400 mb-6'>7-Day Weather Forecast</h1>
                <div className="space-y-4">
                    {forecast.map((day, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                {getWeatherIcon(day.condition)}
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{day.date}</p>
                                    <p className="text-xl capitalize text-gray-600">{day.condition}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Thermometer size={32} className="text-red-500 mr-2" />
                                <span className="text-3xl font-bold text-gray-800">{day.temp}°C</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeatherForecast;