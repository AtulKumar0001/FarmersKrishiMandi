"use client";
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ModeToggle } from "../mode-toggle";
import { useRouter, usePathname } from 'next/navigation';

// Dummy notifications
const dummyNotifications = [
  {
    id: 1,
    User: {
      name: "John Doe",
      avatarUrl: "/pexels-olly-774909.jpg",
    },
    notification: "Contract Request|You have received a new contract request for your|wheat crop.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    User: {
      name: "Jane Smith",
      avatarUrl: "/pexels-olly-774909.jpg",
    },
    notification: "Contract Request|A buyer is interested in your|rice harvest.",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
];

const InfoBar = () => {
  const [notifications] = useState(dummyNotifications);
  const router = useRouter();
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    // Get the current language from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang');
    if (lang) {
      setCurrentLang(lang);
    }
  }, [pathname]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setCurrentLang(newLang);

    // Construct the new URL with the updated language
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('lang', newLang);
    const newUrl = `${pathname}?${urlParams.toString()}`;
    
    router.push(newUrl);
  };

  return (
    <div className="fixed z-[20] top-0 left-[300px] right-0 p-4 bg-background/95 backdrop-blur-md dark:bg-gray-800 bg-white flex items-center justify-between">
      <div className="flex-grow"></div>
      <div className="flex items-center gap-4">
        <select
          id="locale"
          name="locale"
          value={currentLang}
          onChange={handleLanguageChange}
          className="h-9 rounded-md border border-input bg-white dark:bg-background text-black dark:text-white px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:bg-gray-100 dark:focus:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          <option value="en" className="bg-white dark:bg-background text-black dark:text-white hover:bg-primary/90 dark:hover:bg-primary/70">English</option>
          <option value="hi" className="bg-white dark:bg-background text-black dark:text-white hover:bg-primary/90 dark:hover:bg-primary/70">हिंदी</option>
          <option value="bn" className="bg-white dark:bg-background text-black dark:text-white hover:bg-primary/90 dark:hover:bg-primary/70">বাংলা</option>
          <option value="te" className="bg-white dark:bg-background text-black dark:text-white hover:bg-primary/90 dark:hover:bg-primary/70">తెలుగు</option>
          <option value="mr" className="bg-white dark:bg-background text-black dark:text-white hover:bg-primary/90 dark:hover:bg-primary/70">मराठी</option>
          <option value="ta" className="bg-white dark:bg-background text-black dark:text-white hover:bg-primary/90 dark:hover:bg-primary/70">தமிழ்</option>
          <option value="gu" className="bg-white dark:bg-background text-black dark:text-white hover:bg-primary/90 dark:hover:bg-primary/70">ગુજરાતી</option>
          <option value="kn" className="bg-white dark:bg-background text-black dark:text-white hover:bg-primary/90 dark:hover:bg-primary/70">ಕನ್ನಡ</option>
          <option value="ml" className="bg-white dark:bg-background text-black dark:text-white hover:bg-primary/90 dark:hover:bg-primary/70">മലയാളം</option>
          <option value="pa" className="bg-white dark:bg-background text-black dark:text-white hover:bg-primary/90 dark:hover:bg-primary/70">ਪੰਜਾਬੀ</option>
          <option value="ur" className="bg-white dark:bg-background text-black dark:text-white hover:bg-primary/90 dark:hover:bg-primary/70">اردو</option>
        </select>
        <Sheet>
          <SheetTrigger>
            <div className="rounded-full w-9 h-9 bg-primary flex items-center justify-center text-white ">
              <Bell size={17} className="dark:text-black " />
            </div>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-4 mb-6 p-4 rounded-lg bg-white dark:bg-gray-800 hover:bg-secondary/20 dark:hover:bg-gray-700 transition-colors">
                <Avatar className="w-12 h-12 border-2 border-primary">
                  <AvatarImage src={notification.User.avatarUrl} alt="Profile Picture" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {notification.User.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="mb-1 text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-semibold">{notification.notification.split("|")[0]}</span>
                    <span> </span>
                    <span className="text-gray-600 dark:text-gray-400">{notification.notification.split("|")[1]}</span>
                    <span> </span>
                    <span className="font-semibold">{notification.notification.split("|")[2]}</span>
                  </p>
                  <div className="flex items-center justify-between">
                    <small className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notification.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </small>
                    <button className="text-xs text-primary hover:underline">Mark as read</button>
                  </div>
                </div>
              </div>
            ))}
          </SheetContent>
        </Sheet>
        <ModeToggle />
      </div>
    </div>
  );
};

export default InfoBar;
