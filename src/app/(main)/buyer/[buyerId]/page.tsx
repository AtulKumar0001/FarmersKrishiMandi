"use client";

import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoUrl = "https://youtu.be/NS9z2QHcZdY?si=l9OQY6xUBRX1VWAn";
  const videoId = getYouTubeId(videoUrl);

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <p className="text-xl text-gray-600 mb-4">
        Watch this short video to learn how to use our website effectively.
      </p>
      {isClient && videoId && (
        <div className="w-full mb-8">
          <div className="relative pt-[56.25%]">
            <YouTube
              videoId={videoId}
              opts={{
                width: '100%',
                height: '100%',
                playerVars: {
                  autoplay: 1,
                },
              }}
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
      <div className="bg-gray-100 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Guide:</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Navigate through the menu on the left</li>
          <li>Check weather forecasts and crop recommendations</li>
          <li>Check contracts and how to fill your details</li>
          <li>How to get help</li>
        </ol>
      </div>
    </div>
  );
}
