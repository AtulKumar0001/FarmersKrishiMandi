'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sun, Cloud, CloudRain, CloudSnow, Thermometer } from 'lucide-react';

const WeatherForecast = () => {
    const forecast = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        temp: Math.floor(Math.random() * (35 - 20 + 1) + 20),
        condition: ['sunny', 'cloudy', 'rainy', 'snowy'][Math.floor(Math.random() * 4)]
    }));

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
        <div className='flex flex-col items-center w-full font-sans p-4 min-h-screen bg-background transition-colors'>
            <div className='w-full max-w-3xl'>
                {/* Back to Home Button */}
                <Link href="/" className="flex items-center text-white mb-6 text-lg text-primary hover:text-red-100 transition-colors duration-200">
                    <ArrowLeft className="mr-2" />
                    Back to Home
                </Link>

                {/* Title */}
                <h1 className='text-4xl font-bold text-accent mb-6 transition-colors duration-200 dark:text-white'>
                    7-Day Weather Forecast
                </h1>

                {/* Weather Forecast List */}
                <div className="space-y-4">
                    {forecast.map((day, index) => (
                        <div 
                            key={index} 
                            className="bg-card p-6 rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex items-center space-x-6">
                                {getWeatherIcon(day.condition)}
                                <div>
                                    <p className="text-2xl dark:text-white text-black font-bold text-foreground">{day.date}</p>
                                    <p className="text-xl dark:text-white text-black capitalize text-muted-foreground">{day.condition}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Thermometer size={32} className="text-red-500 mr-2" />
                                <span className="text-3xl font-bold text-foreground dark:text-white text-black">{day.temp}°C</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeatherForecast;
