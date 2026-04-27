"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads",     href: "/leads",     icon: Users },
  { label: "Settings",  href: "/settings",  icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside
        className={cn(
          "w-64 bg-white flex flex-col border-r border-border",
          // Mobile: fixed overlay, slide in/out
          "fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: static, always visible
          "lg:static lg:translate-x-0 lg:transition-none lg:z-auto lg:h-auto lg:shrink-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-10 h-10 bg-off-white border border-border rounded-xl flex items-center justify-center shadow-sm shrink-0">
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

          {/* Close button – mobile only */}
          <button
            className="lg:hidden p-1.5 rounded-lg text-ternary hover:bg-off-white hover:text-foreground transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-primary/5 text-primary"
                    : "text-ternary hover:bg-off-white hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    size={20}
                    className={cn(isActive ? "text-primary" : "group-hover:text-foreground")}
                  />
                  <span className="font-semibold text-sm">{item.label}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border mt-auto shrink-0">
          <p className="text-sm font-medium text-ternary px-2 mb-2">Current User</p>
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-off-white transition-colors">
            <div className="w-10 h-10 rounded-full bg-primary border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-sm shrink-0">
              VM
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-foreground truncate">Vivek Makwana</p>
              <p className="text-xs text-ternary truncate">admin@invennico.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
