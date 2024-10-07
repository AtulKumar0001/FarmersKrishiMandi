'use client'
import React, { useState } from 'react'

// List of common crops in India
const cropOptions = [
  'Rice', 'Wheat', 'Maize', 'Millets', 'Pulses', 'Cotton', 'Sugarcane', 'Oilseeds',
  'Fruits', 'Vegetables', 'Tea', 'Coffee', 'Jute', 'Rubber', 'Spices', 'Other'
]

export default function FarmerRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    aadharNumber: '',
    address: '',
    state: '',
    pincode: '',
    crops: [] as string[],
    otherCrop: ''
  })

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission here (e.g., send data to an API)
    console.log('Form submitted:', formData)


    // re route to main
    
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Farmer Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}