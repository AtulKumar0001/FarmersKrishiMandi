import React from 'react'
import MenuOptions from './menu-options'
import { Home, FileText, Settings, HelpCircle } from 'lucide-react'
type Props = {
  farmerId: string | null,
  buyerId: string | null
}
const Sidebar = ({farmerId,buyerId}:Props) => {

  const sidebarOptionFarmer = [
    { id: '1', name: 'Home', link: `/farmer/${farmerId}/Home`, icon: <Home size={20} /> },
    { id: '2', name: 'Land leasing', link: '/users', icon: <FileText size={20} /> },
    { id: '3', name: 'Post harvesting Contract', link: '/users', icon: <FileText size={20} /> },
    { id: '4', name: 'Settings', link: `/farmer/${farmerId}/settings`, icon: <Settings size={20} /> },
    { id: '5', name: 'Help', link: `/farmer/${farmerId}/help`, icon: <HelpCircle size={20} /> },
    { id: '6', name: 'Landing Page', link: `/farmer/${farmerId}`, icon: <HelpCircle size={20} /> },
  ]
  const sidebarOptionBuyer = [
    { id: '1', name: 'Home', link: `/buyer/${buyerId}/Home`, icon: <Home size={20} /> },
    { id: '2', name: 'Land leasing', link: '/users', icon: <FileText size={20} /> },
    { id: '3', name: 'Post harvesting Contract', link: '/users', icon: <FileText size={20} /> },
    { id: '4', name: 'Settings', link: `/buyer/${buyerId}/settings`, icon: <Settings size={20} /> },
    { id: '5', name: 'Help', link: `/buyer/${buyerId}/help`, icon: <HelpCircle size={20} /> },
    { id: '6', name: 'Landing Page', link: `/buyer/${buyerId}`, icon: <HelpCircle size={20} /> },
  ]

  if(farmerId){
    return <MenuOptions
      defaultOpen={true}
      sidebarLogo="/logo.png"  
      sidebarOpt={sidebarOptionFarmer}
    />
  }else{
    return <MenuOptions
      defaultOpen={true}
      sidebarLogo="/logo.png"  
      sidebarOpt={sidebarOptionBuyer}
    />
  }
}

export default Sidebar
