"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="relative min-h-screen w-full bg-gray-100 flex items-center justify-center p-6">

      <Link
        href="/"
        className="fixed top-6 left-6 p-2 rounded-full hover:bg-gray-200 transition shadow-sm"
        title="Retour à l'accueil"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </Link> 

       <div className="w-full h-full flex items-center justify-center p-6">
        <div className="w-full max-w-[1500px] h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
