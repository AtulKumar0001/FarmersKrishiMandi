"use client";
import { useState } from "react";
import { Bell } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ModeToggle } from "../mode-toggle";

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

  return (
    <div className="fixed z-[20] top-0 left-[300px] right-0 p-4 bg-background/95 backdrop-blur-md dark:bg-gray-800 bg-white flex items-center justify-between">
      <div className="flex-grow"></div>
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger>
            <div className="rounded-full w-9 h-9 bg-primary flex items-center justify-center text-white">
              <Bell size={17} className="dark:text-black " />
            </div>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            {notifications.map((notification) => (
              <div key={notification.id} className="flex gap-2 mb-4">
                <Avatar>
                  <AvatarImage src={notification.User.avatarUrl} alt="Profile Picture" />
                  <AvatarFallback>{notification.User.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p>
                    <span className="font-bold">{notification.notification.split("|")[0]}</span>
                    <span className="text-muted-foreground">{notification.notification.split("|")[1]}</span>
                    <span className="font-bold">{notification.notification.split("|")[2]}</span>
                  </p>
                  <small className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </small>
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
