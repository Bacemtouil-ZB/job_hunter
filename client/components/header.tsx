"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";
import { LogIn, UserPlus, Briefcase, Search, PlusCircle, LayoutDashboard } from "lucide-react";
import Profile from "./profile";

function Header() {
  const { isAuthenticated } = useGlobalContext();
  const pathname = usePathname();

  const navLinks = [
    { href: "/findwork", label: "Find Work", icon: Search },
    { href: "/myjobs", label: "My Jobs", icon: Briefcase },
    { href: "/post", label: "Post a Job", icon: PlusCircle },
    {href: "/dashboard", label: "dashbord",  icon: LayoutDashboard},

  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="w-full px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section - Extreme Left */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Image 
                  src="/logo.svg" 
                  alt="Job Hunter Logo" 
                  width={32} 
                  height={32}
                  className="relative z-10"
                />
              </div>
            </div>
            <div>
              <h1 className="font-extrabold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Job Hunter
              </h1>
              <p className="text-xs text-gray-500 font-medium">Find your dream job</p>
            </div>
          </Link>

          {/* Navigation Links - Center */}
          <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                        : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth Section - Extreme Right */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Profile />
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="http://localhost:8000/login"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link
                  href="http://localhost:8000/register"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                >
                  <UserPlus size={18} />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;