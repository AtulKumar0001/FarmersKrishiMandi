import Link from "next/link";
import React from "react";
import { ModeToggle } from "./mode-toggle";
import Image from "next/image";

export default function SiteHeader() {
  const navLinks = [
    { title: "About Us", href: "/site/aboutUs" },
    { title: "Contact Us", href: "/contactUs" },
    { title: "Community", href: "/community" },
  ];

  return (
    <header className="w-full border-b border-border/40 bg-background/95 py-4">
      <div className="container max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
        <Link className="flex items-center space-x-2" href="/">
          <span className="font-bold text-2xl text-primary text-white flex px-2">
            <Image
                height={60}
                width={60}
                alt='logo'
                src="/assets/logo.png"
                className="rounded-full"
            />
            <span>KRISHIमंडी</span>
          </span>
        </Link>
        <nav className="flex items-center space-x-8">
          {navLinks.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="text-sm  font-medium text-muted-foreground hover:text-red-100 transition-colors duration-200 relative group"
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
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>EN</option>
            <option>FR</option>
            <option>AR</option>
          </select>
        </div>
      </div>
    </header>
  );
}
