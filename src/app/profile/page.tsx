"use client";
import Image from "next/image";
import React, { useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "Farmer",
    phoneNumber: "(555) 123-4567",
    address: "123 Farm Road, Countryside, State 12345",
    adhaar: "XXXXXXXXXX",
    panC: "XXXXXXXX",
    profilePic: process.env.DEMO_PROFILE_IMAGE,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSave = () => {
    // Here you would typically send the updated profile to your backend
    console.log("Saving profile:", profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Farmer Profile
        </h1>
        <div className="flex flex-col items-center mb-6">
          <Image
            width={32}
            height={32}
            src={profile.profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
          />
        </div>
        {isEditing ? (
          <div className="space-y-4">
            <input
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
            <input
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
            <input
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
            <input
              name="profilePic"
              value={profile.profilePic}
              onChange={handleInputChange}
              placeholder="Profile Picture URL"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
            <input
              name="adhaar"
              value={profile.adhaar}
              onChange={handleInputChange}
              placeholder="Adhaar Number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
            <input
              name="panC"
              value={profile.panC}
              onChange={handleInputChange}
              placeholder="Pan Card"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
            <button
              onClick={handleSave}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 dark:hover:bg-green-400 transition duration-300"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {profile.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Phone:</span> {profile.phoneNumber}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Address:</span> {profile.address}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Adhaar:</span> {profile.adhaar}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Pan Card:</span> {profile.panC}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-400 transition duration-300"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}