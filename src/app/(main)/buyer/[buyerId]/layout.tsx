import BlurPage from '@/components/global/blur-page'
import Sidebar from '@/components/sidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import InfoBar from '../../../../components/global/infobar'


type Props = {
    children: React.ReactNode
    params: { buyerId: string }
  }

const layout = async ({ children, params }: Props) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login')
  }

  // Check if the user exists in the buyers table and matches the buyerId
  const { data: buyerData, error } = await supabase
    .from('buyer_registrations')
    .select('user_id')
    .eq('user_id', params.buyerId)
    .single()
  console.log(buyerData)

  if (error || !buyerData || user.id !== params.buyerId) {
    // User is not authorized to access this buyer dashboard
    return redirect('/unauthorized')
  }


  return (
    <div className="h-screen overflow-hidden">
      <Sidebar farmerId={null} buyerId = {user.id}  />
      <div className="md:pl-[300px]">
        <InfoBar/>
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  )
}

export default layout
