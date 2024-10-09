"use client";
import MainPage from "@/components/site/MainPage";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    setIsLoggedIn(true);
    return () => setIsLoggedIn(false);
  }, [setIsLoggedIn]);
  return <MainPage />;
}
