"use client";
import React from "react";
import Image from "next/image";
import {
  FaLeaf,
  FaHandshake,
  FaStore,
  FaMicrophone,
  FaCloudSun,
} from "react-icons/fa";

const features = [
  {
    icon: FaLeaf,
    title: "Land Leasing",
    description: "Find or list agricultural land for lease.",
  },
  {
    icon: FaHandshake,
    title: "Pre-Harvest Contracts",
    description: "Secure contracts before planting season.",
  },
  {
    icon: FaStore,
    title: "Post-Harvest Sales",
    description: "Sell your harvested crops with ease.",
  },
];

const testimonials = [
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
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <Image
          src="/hero-image.jpg"
          alt="Farming landscape"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
        <div className="z-10 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Empowering Farmers with Fair Contracts and Secure Payments
          </h1>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center"
              >
                <feature.icon className="text-4xl text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="mb-4">{feature.description}</p>
                <button className="text-green-500 hover:text-green-600 font-semibold">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          {/* Add your infographic or flowchart here */}
          <div className="bg-gray-200 dark:bg-gray-700 p-8 rounded-lg">
            <p className="text-center">
              Insert your infographic or flowchart here
            </p>
          </div>
        </div>
      </section>

      {/* AI Assistance & Weather Alerts Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Smart Farming Features
          </h2>
          <div className="flex justify-center space-x-12">
            <div className="text-center">
              <FaMicrophone className="text-5xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                AI Voice Assistance
              </h3>
              <p>Get help with voice commands</p>
            </div>
            <div className="text-center">
              <FaCloudSun className="text-5xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Weather Alerts</h3>
              <p>Stay informed about weather conditions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
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
      <footer className="bg-gray-800 dark:bg-gray-950 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="p-2 rounded-l-md flex-grow text-gray-800 dark:text-gray-200 dark:bg-gray-700"
                />
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-r-md">
                  Subscribe
                </button>
              </form>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0 text-center">
              <a href="#" className="text-gray-300 hover:text-white mx-2">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 hover:text-white mx-2">
                Terms of Service
              </a>
            </div>
            <div className="w-full md:w-1/3 text-right">
              {/* Add your social media icons here */}
              <p>Social Media Icons</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
