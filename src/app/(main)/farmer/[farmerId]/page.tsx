"use client";

import { useEffect, useState, useMemo } from "react";
import YouTube from "react-youtube";
import { useSearchParams } from 'next/navigation';

type Translations = {
  welcomeTitle: string;
  gettingStartedTitle: string;
  watchVideoText: string;
  quickGuideTitle: string;
  quickGuideItems: string[];
};

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState(searchParams.get('lang') || "en");
  const [translations, setTranslations] = useState<Translations>({} as Translations);
  const [isTranslating, setIsTranslating] = useState(false);

  const contentToTranslate = useMemo<Translations>(() => ({
    welcomeTitle: "Welcome to Farmers Portal",
    gettingStartedTitle: "Getting Started Tutorial",
    watchVideoText: "Watch this short video to learn how to use our website effectively.",
    quickGuideTitle: "Quick Guide:",
    quickGuideItems: [
      "Navigate through the menu on the left",
      "Check weather forecasts and crop recommendations",
      "Review contracts and learn how to fill your details",
      "Discover how to get help when needed"
    ],
  }), []);

  useEffect(() => {
    setIsClient(true);
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

  const getContent = (key: keyof Translations): string | string[] => {
    if (isTranslating || !translations[key]) {
      return contentToTranslate[key];
    }
    return translations[key];
  };

  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoUrl = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_URL || '';
  const videoId = getYouTubeId(videoUrl);

  return (
    <div className="max-w-6xl mx-auto p-8 font-sans bg-gradient-to-br from-green-600 to-green-800 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">{getContent('welcomeTitle') as string}</h1>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {getContent('gettingStartedTitle') as string}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {getContent('watchVideoText') as string}
          </p>
        </div>
        {isClient && videoId && (
          <div className="w-full mb-8 px-6">
            <div className="relative pt-[56.25%] rounded-lg overflow-hidden shadow-md">
              <YouTube
                videoId={videoId}
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: {
                    autoplay: 1,
                  },
                }}
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div>
        )}
        <div className="bg-gray-50 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {getContent('quickGuideTitle') as string}
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            {(getContent('quickGuideItems') as string[]).map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">{index + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
