"use client";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "./mode-toggle";
import Image from "next/image";
import { Button } from "./ui/button";
// import { useAuth } from "@/contexts/AuthContext";
// import { logout } from "@/app/logout/actions";
import { loginWithGoogle } from "@/app/login/actions";
import { redirect } from "next/navigation";

export default function SiteHeader() {
  // const { isLoggedIn } = useAuth();
  const navLinks = [
    { title: "Home", href: "/site" },
    { title: "About Us", href: "/site/aboutUs" },
    { title: "ContactUs", href: "/site/contactUs" },
  ];

  return (
    <header className="w-full border-b dark:border-border/40 dark:bg-background/95  bg-white py-4">
      <div className="container max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
        <Link className="flex items-center space-x-2" href="/">
          <span className="font-bold text-2xl text-primary text-white flex px-2">
            <Image
              height={60}
              width={60}
              alt="logo"
              src="/assets/logo.png"
              className="bg-gray-200 dark:bg-transparent p-1"
            />
            <span className="text-black dark:text-white">KRISHIमंडी</span>
          </span>
        </Link>
        <nav className="flex items-center space-x-8">
          {navLinks.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-black dark:hover:text-white transition-colors duration-200 relative group text-black "
            >
              {item.title}
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <select
            id="locale"
            name="locale"
            className="h-9 rounded-md border border-input bg-white dark:bg-background text-black dark:text-white px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:bg-gray-100 dark:focus:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <option className="bg-white dark:bg-background text-black dark:text-white hover:bg-primary/90 dark:hover:bg-primary/70">
              EN
            </option>
            <option className="bg-white dark:bg-background text-black dark:text-white hover:bg-primary/90 dark:hover:bg-primary/70">
              FR
            </option>
            <option className="bg-white dark:bg-background text-black dark:text-white hover:bg-primary/90 dark:hover:bg-primary/70">
              AR
            </option>
          </select>
          <form
            action={async () => {
              const result = await loginWithGoogle();
              if (result.error) {
                console.log("Error with login");
              } else if (result.url) {
                redirect("/login");
              }
            }}
          >
            <Button
              type="submit"
              className="px-4 py-2 rounded-md bg-white text-black border border-black dark:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-colors duration-200 shadow-sm font-medium text-sm hover:text-white dark:bg-gray-950 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-white"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
