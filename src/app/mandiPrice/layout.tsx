import SiteHeader from '@/components/site-header'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
      <main className="h-full">
        <SiteHeader/>
        {children}
      </main>
  )
}

export default layout
