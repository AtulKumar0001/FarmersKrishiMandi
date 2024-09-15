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
    profilePic:
      "data:image/jpeg;base64,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",
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className=" max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              name="profilePic"
              value={profile.profilePic}
              onChange={handleInputChange}
              placeholder="Profile Picture URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              name="adhaar"
              value={profile.adhaar}
              onChange={handleInputChange}
              placeholder="Adhaar Number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              name="panC"
              value={profile.panC}
              onChange={handleInputChange}
              placeholder="Pan Card"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSave}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {profile.name}
            </h2>
            <p className="text-gray-600">
              <span className="font-medium">Phone:</span> {profile.phoneNumber}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Address:</span> {profile.address}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Adhaar:</span> {profile.adhaar}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Pan Card:</span> {profile.panC}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
