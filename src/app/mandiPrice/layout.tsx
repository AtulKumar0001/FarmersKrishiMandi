import SiteHeader from "@/components/site-header";
import React from "react";
import { Suspense } from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full">
      <SiteHeader />
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </main>
  );
};

export default layout;
