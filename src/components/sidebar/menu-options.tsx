'use client'

import { Button } from '../ui/button'
import { Compass, ChevronsUpDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Separator } from '../ui/separator'

type Props = {
  defaultOpen?: boolean
  sidebarLogo: string
  sidebarOpt: { id: string; name: string; link: string; icon: React.ReactNode }[]
}

const MenuOptions = ({ defaultOpen, sidebarLogo, sidebarOpt }: Props) => {
  console.log("MenuOptions rendering", { defaultOpen, sidebarLogo, sidebarOpt });

  return (
    <div className="bg-background/80 backdrop-blur-xl fixed top-0 left-0 h-full w-[300px] border-r-[1px] p-6">
      <div className="flex flex-col h-full">
        <div className="mb-6 h-20 relative">
          <Image
            src={sidebarLogo}
            alt="Sidebar Logo"
            fill
            className="rounded-md object-contain"
          />
        </div>

        <Button className="w-full mb-6 flex items-center justify-between py-6" variant="ghost">
          <div className="flex items-center text-left gap-2">
            <Compass />
            <div className="flex flex-col">
              <span>Dashboard</span>
              <span className="text-muted-foreground text-sm">Main View</span>
            </div>
          </div>
          <ChevronsUpDown size={16} className="text-muted-foreground" />
        </Button>

        <p className="text-muted-foreground text-xs mb-2">MENU LINKS</p>
        <Separator className="mb-4" />

        <nav className="flex-grow">
          <ul className="space-y-2">
            {sidebarOpt.map((option) => (
              <li key={option.id}>
                <Link
                  href={option.link}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                >
                  {option.icon}
                  <span>{option.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default MenuOptions
