"use client";

import { useEffect, useState } from "react";
import YouTube from "react-youtube";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoUrl = "https://youtu.be/NS9z2QHcZdY?si=l9OQY6xUBRX1VWAn";
  const videoId = getYouTubeId(videoUrl);

  return (
    <div className="max-w-6xl mx-auto p-8 font-sans bg-gradient-to-br from-blue-400 to-blue-600 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">Welcome to Farmers Portal</h1>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Getting Started Tutorial
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Watch this short video to learn how to use our website effectively.
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
            Quick Guide:
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>Navigate through the menu on the left</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>Check weather forecasts and crop recommendations</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>Review contracts and learn how to fill your details</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>Discover how to get help when needed</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
