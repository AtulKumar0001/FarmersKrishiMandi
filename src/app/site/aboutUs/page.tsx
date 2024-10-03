"use client";
import React from "react";
import Image from "next/image";
import { FaLeaf, FaHandshake, FaBalanceScale } from "react-icons/fa";
import Link from "next/link";

const values = [
  {
    icon: FaLeaf,
    title: "Sustainability",
    description:
      "We promote sustainable farming practices to protect our environment.",
  },
  {
    icon: FaHandshake,
    title: "Partnership",
    description: "We foster strong partnerships between farmers and buyers.",
  },
  {
    icon: FaBalanceScale,
    title: "Fairness",
    description:
      "We ensure fair prices and transparent transactions for all parties.",
  },
];

const teamMembers = [
  { name: "Jane Doe", role: "CEO", image: "/team-member-1.jpg" },
  { name: "John Smith", role: "CTO", image: "/team-member-2.jpg" },
  {
    name: "Alice Johnson",
    role: "Head of Operations",
    image: "/team-member-3.jpg",
  },
];

export default function About() {
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
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-xl">
            Connecting Farmers and Buyers for a Sustainable Future
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Mission</h2>
          <p className="text-xl text-center max-w-3xl mx-auto">
            We are dedicated to revolutionizing the agricultural industry by
            providing a platform that empowers farmers, facilitates fair trade,
            and promotes sustainable farming practices. Our goal is to create a
            thriving ecosystem where farmers and buyers can connect,
            collaborate, and prosper together.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center"
              >
                <value.icon className="text-4xl text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
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
              <p className="text-lg mb-4">
                Founded in 2023, our platform was born out of a passion for
                agriculture and a desire to address the challenges faced by
                farmers in the modern world. We recognized the need for a
                digital solution that could bridge the gap between farmers and
                buyers, providing fair opportunities and leveraging technology
                to enhance agricultural practices.
              </p>
              <p className="text-lg">
                Since our inception, we have been working tirelessly to build a
                community of farmers, buyers, and agricultural experts. Our
                journey is driven by the belief that by empowering farmers and
                facilitating transparent transactions, we can contribute to a
                more sustainable and prosperous agricultural sector.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center"
              >
                <Image
                  src="/pexels-olly-774909.jpg"
                  alt={member.name}
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-500 dark:bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8">
            Be part of the agricultural revolution. Sign up today and start
            connecting!
          </p>
          <button className="bg-white text-green-500 hover:bg-gray-100 font-bold py-2 px-6 rounded-full text-lg">
            <Link href={"/login"}>
              <span>Get Started</span>
            </Link>
          </button>
        </div>
      </section>
    </div>
  );
}
