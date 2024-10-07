'use client'
import MainPage from "@/components/site/MainPage";
import SideBar from "@/components/site/SideBar";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    setIsLoggedIn(true);
    return () => setIsLoggedIn(false);
  }, [setIsLoggedIn]);
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='md:w-1/4'>
        <SideBar />
      </div>
      <div className='md:w-3/4'>
        <MainPage />
      </div>
    </div>
  );
}
