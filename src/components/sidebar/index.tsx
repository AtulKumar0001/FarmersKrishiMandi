import React from 'react'
import MenuOptions from './menu-options'
import { Home, FileText, Settings, HelpCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
type Props = {
  farmerId: string | null,
  buyerId: string | null
}
const Sidebar = async ({farmerId,buyerId}:Props) => {

  const sidebarOptionFarmer = [
    { id: '1', name: 'Home', link: `/farmer/${farmerId}/Home`, icon: <Home size={20} /> },
    { id: '2', name: 'Land leasing', link: '/users', icon: <FileText size={20} /> },
    { id: '3', name: 'Post harvesting Contract', link: `/farmer/${farmerId}/postHarvesting`, icon: <FileText size={20} /> },
    { id: '4', name: 'Settings', link: `/farmer/${farmerId}/settings`, icon: <Settings size={20} /> },
    { id: '5', name: 'Help', link: `/farmer/${farmerId}/help`, icon: <HelpCircle size={20} /> },
    { id: '6', name: 'Landing Page', link: `/farmer/${farmerId}`, icon: <HelpCircle size={20} /> },
  ]
  const sidebarOptionBuyer = [
    { id: '1', name: 'Home', link: `/buyer/${buyerId}/Home`, icon: <Home size={20} /> },
    { id: '2', name: 'Land leasing', link: '/users', icon: <FileText size={20} /> },
    { id: '3', name: 'Post harvesting Contract', link: `/buyer/${buyerId}/postHarvesting`, icon: <FileText size={20} /> },
    { id: '4', name: 'Settings', link: `/buyer/${buyerId}/settings`, icon: <Settings size={20} /> },
    { id: '5', name: 'Help', link: `/buyer/${buyerId}/help`, icon: <HelpCircle size={20} /> },
    { id: '6', name: 'Landing Page', link: `/buyer/${buyerId}`, icon: <HelpCircle size={20} /> },
  ]

  if(farmerId){
    const supabase = createClient();
    const { data: farmerData, error } = await supabase
      .from('farmer_registrations')
      .select('user_id, name') 
      .eq('user_id', farmerId)
      .single()

    if (error) {
      console.error('Error fetching farmer data:', error)
      return null 
    }

    return <MenuOptions
      defaultOpen={true}
      sidebarLogo="/logo.png"  
      userName={farmerData?.name || 'Farmer'} // Use the farmer's name, fallback to 'Farmer' if not available
      sidebarOpt={sidebarOptionFarmer}
    />
  }else{
    const supabase = createClient();
    const { data: BuyerData, error } = await supabase
      .from('buyer_registrations')
      .select('user_id, name') 
      .eq('user_id', buyerId)
      .single()

    if (error) {
      console.error('Error fetching farmer data:', error)
      return null 
    }
    console.log(BuyerData)
    return <MenuOptions
      defaultOpen={true}
      sidebarLogo="/logo.png"  
      userName={BuyerData?.name || 'Buyer'}
      sidebarOpt={sidebarOptionBuyer}
    />
  }
}

export default Sidebar
