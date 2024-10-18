"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaLeaf, FaHandshake, FaBalanceScale } from "react-icons/fa";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

type Translations = {
  aboutUs: string;
  tagline: string;
  ourMission: string;
  missionStatement: string;
  ourValues: string;
  sustainability: string;
  sustainabilityDesc: string;
  partnership: string;
  partnershipDesc: string;
  fairness: string;
  fairnessDesc: string;
  ourStory: string;
  storyPart1: string;
  storyPart2: string;
  ourTeam: string;
  joinCommunity: string;
  joinDescription: string;
  getStarted: string;
  [key: string]: string; // Allow for dynamic keys
};

const values = [
  {
    icon: FaLeaf,
    title: "Sustainability",
    description: "We promote sustainable farming practices to protect our environment.",
  },
  {
    icon: FaHandshake,
    title: "Partnership",
    description: "We foster strong partnerships between farmers and buyers.",
  },
  {
    icon: FaBalanceScale,
    title: "Fairness",
    description: "We ensure fair prices and transparent transactions for all parties.",
  },
];

const teamMembers = [
  { name: "Jane Doe", role: "CEO", image: "/team-member-1.jpg" },
  { name: "John Smith", role: "CTO", image: "/team-member-2.jpg" },
  { name: "Alice Johnson", role: "Head of Operations", image: "/team-member-3.jpg" },
];

export default function About() {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState(searchParams.get('lang') || "en");
  const [translations, setTranslations] = useState<Translations>({} as Translations);
  const [isTranslating, setIsTranslating] = useState(false);

  const contentToTranslate: Translations = {
    aboutUs: "About Us",
    tagline: "Connecting Farmers and Buyers for a Sustainable Future",
    ourMission: "Our Mission",
    missionStatement: "We are dedicated to revolutionizing the agricultural industry by providing a platform that empowers farmers, facilitates fair trade, and promotes sustainable farming practices. Our goal is to create a thriving ecosystem where farmers and buyers can connect, collaborate, and prosper together.",
    ourValues: "Our Values",
    sustainability: "Sustainability",
    sustainabilityDesc: "We promote sustainable farming practices to protect our environment.",
    partnership: "Partnership",
    partnershipDesc: "We foster strong partnerships between farmers and buyers.",
    fairness: "Fairness",
    fairnessDesc: "We ensure fair prices and transparent transactions for all parties.",
    ourStory: "Our Story",
    storyPart1: "Founded in 2023, our platform was born out of a passion for agriculture and a desire to address the challenges faced by farmers in the modern world. We recognized the need for a digital solution that could bridge the gap between farmers and buyers, providing fair opportunities and leveraging technology to enhance agricultural practices.",
    storyPart2: "Since our inception, we have been working tirelessly to build a community of farmers, buyers, and agricultural experts. Our journey is driven by the belief that by empowering farmers and facilitating transparent transactions, we can contribute to a more sustainable and prosperous agricultural sector.",
    ourTeam: "Our Team",
    joinCommunity: "Join Our Community",
    joinDescription: "Be part of the agricultural revolution. Sign up today and start connecting!",
    getStarted: "Get Started",
  };

  useEffect(() => {
    const newLang = searchParams.get('lang');
    if (newLang && newLang !== language) {
      setLanguage(newLang);
    }
    // Always set isTranslating to true when component mounts or language changes
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

        const translatedContent = await response.json();
        setTranslations(translatedContent);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslations(contentToTranslate);
      } finally {
        setIsTranslating(false);
      }
    };

    // Always call translateContent when this effect runs
    translateContent();
  }, [language]); // Remove isTranslating from dependencies

  const getContent = (key: keyof Translations) => {
    if (isTranslating || !translations[key]) {
      return contentToTranslate[key];
    }
    return translations[key];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center text-white">
        <Image
          src="/pexels-alejandro-barron-21404-96715.jpg"
          alt="Farm landscape"
          fill
          style={{ objectFit: "cover" }}
          className="z-0"
        />
        <div className="z-10 text-center">
          <h1 className="text-4xl font-bold mb-4">{getContent('aboutUs')}</h1>
          <p className="text-xl">{getContent('tagline')}</p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">{getContent('ourMission')}</h2>
          <p className="text-xl text-center max-w-3xl mx-auto">{getContent('missionStatement')}</p>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{getContent('ourValues')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
                <value.icon className="text-4xl text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{getContent(value.title.toLowerCase() as keyof Translations)}</h3>
                <p>{getContent(`${value.title.toLowerCase()}Desc` as keyof Translations)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">{getContent('ourStory')}</h2>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <Image
                src="/pexels-tomfisk-1595108.jpg"
                alt="Farmers in a field"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
            <div className="md:w-1/2">
              <p className="text-lg mb-4">{getContent('storyPart1')}</p>
              <p className="text-lg">{getContent('storyPart2')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{getContent('ourTeam')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
                <Image
                  src="/pexels-olly-774909.jpg"
                  alt={member.name}
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-500 dark:bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{getContent('joinCommunity')}</h2>
          <p className="text-xl mb-8">{getContent('joinDescription')}</p>
          <button className="bg-white text-green-500 hover:bg-gray-100 font-bold py-2 px-6 rounded-full text-lg">
            <Link href={"/login"}>
              <span>{getContent('getStarted')}</span>
            </Link>
          </button>
        </div>
      </section>
    </div>
  );
}
