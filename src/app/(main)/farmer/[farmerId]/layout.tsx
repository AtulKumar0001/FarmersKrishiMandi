import BlurPage from '@/components/global/blur-page'
import Sidebar from '@/components/sidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'


type Props = {
    children: React.ReactNode
  }

const layout = async ({ children }: Props) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if(!user){
    return redirect('/')
  }
  console.log(user.id)

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar farmerId = {user.id}  />
      <div className="md:pl-[300px]">
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  )
}

export default layout
