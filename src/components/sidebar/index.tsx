import React from 'react'
import MenuOptions from './menu-options'
import { Home, FileText, Settings, HelpCircle } from 'lucide-react'
type Props = {
  farmerId: string
}
const Sidebar = ({farmerId}:Props) => {

  const sidebarOptions = [
    { id: '1', name: 'Home', link: `/farmer/${farmerId}/Home`, icon: <Home size={20} /> },
    { id: '2', name: 'Land leasing', link: '/users', icon: <FileText size={20} /> },
    { id: '3', name: 'Pre Sowing Contract', link: '/users', icon: <FileText size={20} /> },
    { id: '4', name: 'Post harvesting Contract', link: '/users', icon: <FileText size={20} /> },
    { id: '5', name: 'Settings', link: `/farmer/${farmerId}/settings`, icon: <Settings size={20} /> },
    { id: '6', name: 'Help', link: `/farmer/${farmerId}/help`, icon: <HelpCircle size={20} /> },
    { id: '7', name: 'Landing Page', link: `/farmer/${farmerId}`, icon: <HelpCircle size={20} /> },
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
