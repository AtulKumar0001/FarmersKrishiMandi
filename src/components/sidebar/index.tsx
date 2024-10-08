import React from 'react'
import MenuOptions from './menu-options'
import { Home, Users, Settings, HelpCircle } from 'lucide-react'

const Sidebar = () => {
  console.log("Sidebar component rendering");

  const sidebarOptions = [
    { id: '1', name: 'Home', link: '/', icon: <Home size={20} /> },
    { id: '2', name: 'Users', link: '/users', icon: <Users size={20} /> },
    { id: '3', name: 'Settings', link: '/settings', icon: <Settings size={20} /> },
    { id: '4', name: 'Help', link: '/help', icon: <HelpCircle size={20} /> },
  ]

  return (
    <MenuOptions
      defaultOpen={true}
      sidebarLogo="/logo.png"  
      sidebarOpt={sidebarOptions}
    />
  )
}

export default Sidebar
