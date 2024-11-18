// app/settings/page.tsx
'use client'

import Settings from '@/components/settings/Settings'
import React from 'react'


// Mock function to get the current user ID.
// Replace this with your actual authentication logic.
const getCurrentUserId = (): string => {
  // For demonstration purposes, return a static user ID.
  // In a real application, retrieve this from your auth provider.
  return 'user-unique-id'
}

const SettingsPage: React.FC = () => {
  const userId = getCurrentUserId()

  return (
  <div className='flex'>

   {/* @ts-expect-error - The Settings component prop types are not yet defined */}
   <Settings userId={userId} />
  </div>
  ) 
}

export default SettingsPage
