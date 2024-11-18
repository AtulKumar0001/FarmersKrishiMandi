"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import {
  FaLeaf,
  FaHandshake,
  FaStore,
  FaMicrophone,
  FaCloudSun,
} from "react-icons/fa";

type Feature = {
  icon: keyof typeof Icons;
  title: string;
  description: string;
};

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

type Translations = {
  heroTitle: string;
  getStarted: string;
  ourFeatures: string;
  learnMore: string;
  howItWorks: string;
  infographicPlaceholder: string;
  smartFarmingFeatures: string;
  aiVoiceAssistance: string;
  aiVoiceDescription: string;
  weatherAlerts: string;
  weatherAlertsDescription: string;
  whatOurUsersSay: string;
  stayUpdated: string;
  emailPlaceholder: string;
  subscribe: string;
  privacyPolicy: string;
  termsOfService: string;
  socialMediaIcons: string;
  features: Feature[];
  testimonials: Testimonial[];
};

// Define an object with all your icons
const Icons = {
  FaLeaf,
  FaHandshake,
  FaStore,
  FaMicrophone,
  FaCloudSun,
};

export default function Home() {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState(searchParams.get('lang') || "en");
  const [translations, setTranslations] = useState<Translations>({} as Translations);
  const [isTranslating, setIsTranslating] = useState(false);

  const contentToTranslate = useMemo<Translations>(() => ({
    heroTitle: "Empowering Farmers with Fair Contracts and Secure Payments",
    getStarted: "Get Started",
    ourFeatures: "Our Features",
    learnMore: "Learn More",
    howItWorks: "How It Works",
    infographicPlaceholder: "Insert your infographic or flowchart here",
    smartFarmingFeatures: "Smart Farming Features",
    aiVoiceAssistance: "AI Voice Assistance",
    aiVoiceDescription: "Get help with voice commands",
    weatherAlerts: "Weather Alerts",
    weatherAlertsDescription: "Stay informed about weather conditions",
    whatOurUsersSay: "What Our Users Say",
    stayUpdated: "Stay Updated",
    emailPlaceholder: "Enter your email",
    subscribe: "Subscribe",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    socialMediaIcons: "Social Media Icons",
    features: [
      {
        icon: "FaLeaf",
        title: "Land Leasing",
        description: "Find or list agricultural land for lease.",
      },
      {
        icon: "FaHandshake",
        title: "Pre-Harvest Contracts",
        description: "Secure contracts before planting season.",
      },
      {
        icon: "FaStore",
        title: "Post-Harvest Sales",
        description: "Sell your harvested crops with ease.",
      },
    ],
    testimonials: [
      {
        name: "John Doe",
        role: "Farmer",
        quote: "This platform has revolutionized how I do business.",
      },
      {
        name: "Jane Smith",
        role: "Buyer",
        quote: "I've found reliable suppliers thanks to this service.",
      },
    ],
  }), []);

  useEffect(() => {
    const newLang = searchParams.get('lang');
    if (newLang && newLang !== language) {
      setLanguage(newLang);
    }
    setIsTranslating(true);
  }, [searchParams, language]);

  useEffect(() => {
    const translateContent = async () => {
      if (language === 'en') {
        setTranslations(contentToTranslate);
        setIsTranslating(false);
        return;
      }

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ texts: contentToTranslate, targetLanguage: language }),
        });

        if (!response.ok) {
          throw new Error('Translation request failed');
        }

        const translatedContent: Translations = await response.json();
        
        // Preserve the icon property for features
        translatedContent.features = translatedContent.features.map((feature, index) => ({
          ...feature,
          icon: contentToTranslate.features[index].icon
        }));

        setTranslations(translatedContent);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslations(contentToTranslate);
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [language, contentToTranslate]);

  const getContent = (key: keyof Translations): string | Feature[] | Testimonial[] => {
    if (isTranslating || !translations[key]) {
      return contentToTranslate[key];
    }
    return translations[key];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <Image 
          src="/hero-image.jpg" 
          alt="Farming landscape" 
          fill
          style={{ objectFit: 'cover' }}
          className="z-0"
        />
        <div className="z-10 text-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {getContent('heroTitle') as string}
          </h1>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 sm:mt-0">
            <Link href="/login">
              <span>{getContent('getStarted') as string}</span>
            </Link>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">{getContent('ourFeatures') as string}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {(getContent('features') as Feature[]).map((feature: Feature, index: number) => {
              const Icon = Icons[feature.icon];
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center"
                >
                  {Icon && <Icon className="text-4xl text-green-500 mx-auto mb-4" />}
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="mb-4">{feature.description}</p>
                  <button className="text-green-500 hover:text-green-600 font-semibold">
                    {getContent('learnMore') as string}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">{getContent('howItWorks') as string}</h2>
          <div className="bg-gray-200 dark:bg-gray-700 p-6 sm:p-8 rounded-lg">
            <p className="text-center">
              {getContent('infographicPlaceholder') as string}
            </p>
          </div>
        </div>
      </section>

      {/* AI Assistance & Weather Alerts Section */}
      <section className="py-12 sm:py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            {getContent('smartFarmingFeatures') as string}
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-12">
            <div className="text-center">
              <FaMicrophone className="text-5xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {getContent('aiVoiceAssistance') as string}
              </h3>
              <p>{getContent('aiVoiceDescription') as string}</p>
            </div>
            <div className="text-center">
              <FaCloudSun className="text-5xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{getContent('weatherAlerts') as string}</h3>
              <p>{getContent('weatherAlertsDescription') as string}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            {getContent('whatOurUsersSay') as string}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {(getContent('testimonials') as Testimonial[]).map((testimonial: Testimonial, index: number) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md"
              >
                <p className="italic mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonial.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-white py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">{getContent('stayUpdated') as string}</h3>
              <form className="flex">
                <input
                  type="email"
                  placeholder={getContent('emailPlaceholder') as string}
                  className="p-2 rounded-l-md flex-grow text-gray-800 dark:text-gray-200 dark:bg-gray-700"
                />
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-r-md">
                  {getContent('subscribe') as string}
                </button>
              </form>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0 text-center">
              <a href="#" className="text-gray-300 hover:text-white mx-2">
                {getContent('privacyPolicy') as string}
              </a>
              <a href="#" className="text-gray-300 hover:text-white mx-2">
                {getContent('termsOfService') as string}
              </a>
            </div>
            <div className="w-full md:w-1/3 text-right">
              <p>{getContent('socialMediaIcons') as string}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
