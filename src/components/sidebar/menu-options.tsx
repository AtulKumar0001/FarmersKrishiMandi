"use client";

import { Button } from "../ui/button";
import { Compass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { logout } from "@/app/logout/actions";
import { useRouter } from "next/navigation";

type Props = {
  defaultOpen?: boolean;
  sidebarLogo: string;
  sidebarOpt: {
    id: string;
    name: string;
    link: string;
    icon: React.ReactNode;
  }[];
  userRole : string,
};

const MenuOptions = ({ sidebarLogo, sidebarOpt, userRole }: Props) => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <div className="bg-white backdrop-blur-xl fixed top-0 left-0 h-full w-[300px] border-r-[1px] p-6 dark:bg-gray-800 flex flex-col">
      <div className="mb-6 h-20 relative">
        <Image
          src={sidebarLogo}
          alt="Sidebar Logo"
          fill
          className="rounded-md object-contain"
        />
      </div>

      <Button
        className="w-full mb-6 flex items-center justify-between py-6"
        variant="ghost"
      >
        <div className="flex items-center text-left gap-2">
          <Compass className="text-black dark:text-white" />
          <div className="flex flex-col">
            <span className="text-black dark:text-white">Dashboard</span>
            <span className="text-muted-foreground text-sm ">{userRole}</span>
          </div>
        </div>
      </Button>

      <p className="text-muted-foreground text-black text-xs mb-2 dark:text-white">MENU LINKS</p>
      <Separator className="mb-4" />

      <nav className="flex-grow overflow-y-auto">
        <ul className="space-y-2">
          {sidebarOpt.map((option) => (
            <li key={option.id}>
              <Link
                href={option.link}
                className="flex items-center gap-3 text-black hover:text-white dark:text-white p-2 rounded-md hover:bg-gray-500 transition-colors border border-white"
              >
                {option.icon}
                <span>{option.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Button
        variant="destructive"
        className="w-full mt-3 mb-4 hover:bg-red-600 transition-colors"
        onClick={handleLogout}
      >
        <span>Sign out</span>
      </Button>
    </div>
  );
};

export default MenuOptions;
