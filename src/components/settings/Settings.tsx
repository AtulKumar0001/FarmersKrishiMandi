// components/Settings.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)

// List of common crops in India
const cropOptions = [
  'Rice', 'Wheat', 'Maize', 'Millets', 'Pulses', 'Cotton', 'Sugarcane', 'Oilseeds',
  'Fruits', 'Vegetables', 'Tea', 'Coffee', 'Jute', 'Rubber', 'Spices', 'Other'
]

interface FarmerData {
  name: string;
  aadhar_number: string;
  address: string;
  state: string;
  pincode: string;
  crops: string[];
  other_crop: string | null;
  photo_url: string | null;
}

const Settings: React.FC = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<{
    name: string;
    aadharNumber: string;
    address: string;
    state: string;
    pincode: string;
    crops: string[];
    otherCrop: string;
    photo: File | null;
  }>({
    name: '',
    aadharNumber: '',
    address: '',
    state: '',
    pincode: '',
    crops: [],
    otherCrop: '',
    photo: null
  })
  
  const [existingPhoto, setExistingPhoto] = useState<string | null>(null)
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/')
      const id = pathSegments[2] // Assuming the user ID is the third segment in the path
      setUserId(id)
    }
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return

      const { data, error } = await supabase
        .from<FarmerData>('farmer_registrations')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user data:', error)
      } else if (data) {
        console.log(data)
        setFormData({
          name: data.name,
          aadharNumber: data.aadhar_number,
          address: data.address,
          state: data.state,
          pincode: data.pincode,
          crops: data.crops || [],
          otherCrop: data.other_crop || '',
          photo: null
        })
        setExistingPhoto(data.profile_picture_url)
        setPreviewPhoto(data.profile_picture_url)
      }
    }
    fetchUserData()
  }, [userId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleCropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const crop = e.target.value
    setFormData(prevState => ({
      ...prevState,
      crops: e.target.checked
        ? [...prevState.crops, crop]
        : prevState.crops.filter(c => c !== crop)
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData(prevState => ({ ...prevState, photo: file }))
      setPreviewPhoto(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      let photoUrl = existingPhoto

      if (formData.photo) {
        const fileExt = formData.photo.name.split('.').pop()
        const fileName = `${userId}-${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase
          .storage
          .from('PFP')
          .upload(filePath, formData.photo, {
            upsert: true
          })

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase
          .storage
          .from('PFP')
          .getPublicUrl(filePath)

        photoUrl = publicUrlData.publicUrl
      }

      const { error } = await supabase
        .from('farmer_registrations')
        .update({
          name: formData.name,
          aadhar_number: formData.aadharNumber,
          address: formData.address,
          state: formData.state,
          pincode: formData.pincode,
          crops: formData.crops,
          other_crop: formData.otherCrop || null,
          profile_picture_url: photoUrl
        })
        .eq('user_id', userId)

      if (error) throw error

      setSuccess('Profile updated successfully.')
      setExistingPhoto(photoUrl)
      router.refresh()
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('An error occurred while updating your profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 py-12 px-8 sm:px-12 lg:px-16">    
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Column */}
          <div className="w-full lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Profile Settings</h2>
            {/* Profile Photo */}
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">Profile Photo</h3>
              <div className="flex items-center space-x-6">
                {previewPhoto ? (
                  <Image
                    src={previewPhoto}
                    alt="Profile Photo"
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">No Photo</span>
                  </div>
                )}
                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Change Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-300
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-md file:border-0
                               file:text-sm file:font-semibold
                               file:bg-green-50 file:text-green-700
                               hover:file:bg-green-100 dark:file:bg-gray-700
                               dark:file:text-gray-300"
                  />
                </div>
              </div>
            </div>
            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4">Basic Information</h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  {/* Aadhaar Number */}
                  <div>
                    <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      name="aadharNumber"
                      id="aadharNumber"
                      required
                      value={formData.aadharNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                      pattern="\d{12}"
                      title="Please enter a valid 12-digit Aadhaar number"
                    />
                  </div>
                  {/* Submit Button */}
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                  ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* Right Column */}
          <div className="w-full lg:w-1/2 p-6">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Additional Settings</h2>
            {/* Address Information */}
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4">Address</h3>
              <div className="space-y-4">
                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Street Address
                  </label>
                  <textarea
                    name="address"
                    id="address"
                    rows={3}
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                  ></textarea>
                </div>
                {/* State and Pincode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* State */}
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  {/* Pincode */}
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      id="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                      pattern="\d{6}"
                      title="Please enter a valid 6-digit pincode"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Crops Information */}
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4">Crops Information</h3>
              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Types of Crops Grown
                </span>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                      <label htmlFor={crop} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        {crop}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {formData.crops.includes('Other') && (
                <div>
                  <label htmlFor="otherCrop" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Other Crop
                  </label>
                  <input
                    type="text"
                    name="otherCrop"
                    id="otherCrop"
                    value={formData.otherCrop}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              )}
            </div>
            {/* Success and Error Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Settings