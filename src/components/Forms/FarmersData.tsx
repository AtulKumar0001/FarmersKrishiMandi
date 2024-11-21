"use client";
import React, { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// List of common crops in India
const cropOptions = [
  "Rice",
  "Wheat",
  "Maize",
  "Millets",
  "Pulses",
  "Cotton",
  "Sugarcane",
  "Oilseeds",
  "Fruits",
  "Vegetables",
  "Tea",
  "Coffee",
  "Jute",
  "Rubber",
  "Spices",
  "Other",
];

interface FarmerRegistrationProps {
  userId: string;
}

export default function FarmerRegistration({
  userId,
}: FarmerRegistrationProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    aadharNumber: "",
    address: "",
    state: "",
    pincode: "",
    crops: [] as string[],
    otherCrop: "",
    phone_number: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const crop = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      crops: e.target.checked
        ? [...prevState.crops, crop]
        : prevState.crops.filter((c) => c !== crop),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let profilePictureUrl = null;

      // Upload profile picture if selected
      if (profilePicture) {
        const fileExt = profilePicture.name.split(".").pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;

        // Check if the bucket exists, if not create it
        const { data: buckets, error: bucketError } =
          await supabase.storage.listBuckets();
        if (bucketError) throw bucketError;

        if (!buckets.find((bucket) => bucket.name === "dude")) {
          console.log(89);
        }

        const { error: uploadError } = await supabase.storage
          .from("PFP")
          .upload(fileName, profilePicture, { upsert: true });

        if (uploadError) throw uploadError;

        // Get public URL of uploaded file
        const {
          data: { publicUrl },
        } = supabase.storage.from("PFP").getPublicUrl(fileName);

        profilePictureUrl = publicUrl;
        console.log(9);
      }

      // Filter out "Other" from crops array
      const filteredCrops = formData.crops.filter((crop) => crop !== "Other");

      // First, check if a registration already exists for this user
      const { data: existingRegistration, error: fetchError } = await supabase
        .from("farmer_registrations")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 means no rows returned, which is fine in this case
        throw fetchError;
      }

      let result;
      if (existingRegistration) {
        // Update existing registration
        result = await supabase
          .from("farmer_registrations")
          .update({
            name: formData.name,
            aadhar_number: formData.aadharNumber,
            address: formData.address,
            state: formData.state,
            pincode: formData.pincode,
            crops: filteredCrops,
            other_crop: formData.otherCrop || null,
            profile_picture_url: profilePictureUrl,
            role: "farmer",
            phone_number: formData.phone_number,
          })
          .eq("user_id", userId);
      } else {
        // Insert new registration
        result = await supabase.from("farmer_registrations").insert({
          user_id: userId,
          name: formData.name,
          aadhar_number: formData.aadharNumber,
          address: formData.address,
          state: formData.state,
          pincode: formData.pincode,
          crops: filteredCrops,
          other_crop: formData.otherCrop || null,
          role: "farmer",
          phone_number: formData.phone_number,
          profile_picture_url: profilePictureUrl,
        });
      }

      if (result.error) throw result.error;

      console.log("Registration successful:", result.data);
      router.push(`/farmer/${userId}`); // Redirect to main page after successful registration
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        `An error occurred while submitting the form: || 'Please try again.'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Farmer Registration
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Enter your Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  id="phone_number"
                  placeholder="0123456789"
                  pattern="[0-9]{10}"
                  required
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  title="Please enter a valid 10 Digit number"
                />
              </div>

              <div>
                <label
                  htmlFor="aadharNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Aadhar Card Number
                </label>
                <input
                  type="text"
                  name="aadharNumber"
                  id="aadharNumber"
                  required
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  pattern="\d{12}"
                  title="Please enter a valid 12-digit Aadhar number"
                />
              </div>

              

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Address
                </label>
                <textarea
                  name="address"
                  id="address"
                  rows={3}
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="pincode"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  id="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  pattern="\d{6}"
                  title="Please enter a valid 6-digit pincode"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Types of Crops Grown
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {cropOptions.map((crop) => (
                    <div key={crop} className="flex items-center">
                      <input
                        type="checkbox"
                        id={crop}
                        name="crops"
                        value={crop}
                        checked={formData.crops.includes(crop)}
                        onChange={handleCropChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={crop}
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        {crop}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {formData.crops.includes("Other") && (
                <div>
                  <label
                    htmlFor="otherCrop"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Other Crop
                  </label>
                  <input
                    type="text"
                    name="otherCrop"
                    id="otherCrop"
                    value={formData.otherCrop}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}

              {/* Profile Picture Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Profile Picture
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  {previewUrl && (
                    <Image
                      src={previewUrl}
                      alt="Profile preview"
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {previewUrl ? "Change Picture" : "Upload Picture"}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
