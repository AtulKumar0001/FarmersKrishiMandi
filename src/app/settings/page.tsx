// app/settings/page.tsx
'use client'

import React from 'react'
import Settings from '../../components/settings/Settings'


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

  <Settings userId={userId} />
  </div>
  ) 
}

export default SettingsPage
