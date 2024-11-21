import BlurPage from '@/components/global/blur-page'
import Sidebar from '@/components/sidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import InfoBar from '../../../../components/global/infobar'
import { Toaster } from '@/components/ui/toaster'


type Props = {
    children: React.ReactNode
    params: { farmerId: string }
  }

const layout = async ({ children, params }: Props) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if(!user){
    return redirect('/')
  }
  
  // Check if the user exists in the buyers table and matches the buyerId
  const { data: buyerData, error } = await supabase
    .from('farmer_registrations')
    .select('user_id')
    .eq('user_id', params.farmerId)
    .single()
  console.log(buyerData)

  if (error || !buyerData || user.id !== params.farmerId) {
    // User is not authorized to access this buyer dashboard
    return redirect('/unauthorized')
  }

  return (
    <div className="h-screen overflow-hidden">
      {await Sidebar({ farmerId: user.id, buyerId: null })}
      <div className="md:pl-[300px]">
        <InfoBar/>
        <div className="relative">
          <BlurPage>{children} 
          <Toaster />
          </BlurPage>
        </div>
      </div>
    </div>
  )
}

export default layout
