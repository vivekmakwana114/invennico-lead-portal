"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ChevronRight,
  LogOut
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Leads",
    href: "/leads",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-white flex flex-col h-full sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-off-white border border-border rounded-xl flex items-center justify-center shadow-sm">
            <Image 
              src="/assets/logo/Invennico.svg" 
              alt="Invennico Logo" 
              width={24} 
              height={24}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="font-bold text-sm leading-tight text-foreground">Invennico</h2>
            <p className="text-[10px] text-ternary font-medium uppercase tracking-wider">Lead Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary/5 text-primary" 
                  : "text-ternary hover:bg-off-white hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={cn(isActive ? "text-primary" : "group-hover:text-foreground")} />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-off-white transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-foreground truncate">Admin User</p>
              <p className="text-[10px] text-ternary truncate">admin@invennico.com</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-ternary group-hover:text-foreground" />
        </div>
      </div>
    </aside>
  );
}
