"use client";

import { useState } from "react";
import { LayoutGrid, BarChart3, Map, Layers, Settings } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  const menu = [
    { name: "Overview", icon: LayoutGrid, href: "/dashboard" },
    { name: "Statistics", icon: BarChart3, href: "/dashboard/stats" },
    { name: "Geography", icon: Map, href: "/dashboard/map" },
    { name: "Skills", icon: Layers, href: "/dashboard/skills" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          open ? "w-64" : "w-20"
        } bg-white shadow-sm border-r border-gray-200 transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className={`${open ? "text-xl font-bold" : "hidden"} text-gray-700`}>
            JobHunter
          </h1>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>

        <nav className="mt-6 space-y-2">
          {menu.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={i}
                href={item.href}
                className="flex items-center gap-3 py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <Icon className="w-5 h-5 text-gray-600" />
                {open && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
