"use client";

import React from "react";
import { Home, Book, Globe, User, LogOut } from "lucide-react";
import Link from "next/link";

const SideBar = () => {
  return (
    <div className="h-screen w-full text-foreground bg-background/95 shadow-lg p-6 font-sans flex flex-col justify-between">
      <div>
        <div className="space-y-4">
          <NavItem icon={<Home size={20} />} label="Home" />

          <div>
            <NavItem icon={<Book size={20} />} label="Contracts" />
            <div className="mt-2 ml-8 space-y-2 text-sm">
              <StatusItem color="bg-orange-400" label="Total Contracts: 4" />
              <StatusItem color="bg-yellow-400" label="Active Contracts: 2" />
              <StatusItem color="bg-green-500" label="Completed Contracts: 1" />
              <StatusItem color="bg-blue-400" label="Ongoing Delivery: 1" />
            </div>
          </div>

          <NavItem icon={<Globe size={20} />} label="Bid section" />
          <div className="mt-2 ml-8 space-y-2 text-sm">
            <StatusItem color="bg-orange-400" label="Total Bid: 4" />
            <StatusItem color="bg-yellow-400" label="Active Bid: 2" />
            <StatusItem color="bg-green-500" label="Completed Bid: 1" />
            <StatusItem color="bg-blue-400" label="Ongoing Bid: 1" />
          </div>

          <NavItem icon={<Globe size={20} />} label="Lease land" />

          <div className="flex items-center gap-3 bg-accent/50 p-3 hover:text-black dark:hover:text-white rounded-lg hover:bg-accent/70 dark:hover:bg-accent/80 transition-colors duration-200">
            <User size={20} />
            <span className="text-lg hover:text-black">Rahul</span>
          </div>

          <Link
            href="/profile"
            className="flex items-center gap-3 hover:text-black dark:hover:text-white bg-accent/50 p-3 rounded-lg hover:bg-accent/70 dark:hover:bg-accent/80 transition-colors duration-200"
          >
            <span className="text-lg hover:text-black">Profile</span>
          </Link>

          <button className="flex items-center gap-3 w-full bg-destructive text-destructive-foreground p-3 rounded-lg hover:bg-destructive/80 dark:hover:bg-destructive/90 transition-colors duration-200">
            <LogOut size={20} />
            <span className="text-lg">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="flex items-center gap-3 w-full bg-accent/50 p-3 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors duration-200 hover:text-black dark:hover:text-white">
    {icon}
    <span className="text-lg">{label}</span>
  </button>
);

const StatusItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2 p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 hover:text-black dark:hover:text-white">
    <div className={`w-2 h-2 rounded-full ${color}`}></div>
    <span>{label}</span>
  </div>
);

export default SideBar;