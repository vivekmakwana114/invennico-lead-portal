"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, User, LogOut } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  leads:     "Leads",
  create:    "Create New Lead",
  analyzing: "Analyzing Lead",
  settings:  "Settings",
  profile:   "My Profile",
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const pathSegments = pathname?.split("/").filter(Boolean) ?? [];

  const getPageTitle = () => {
    if (pathSegments.length === 0) return "Dashboard";
    const last = pathSegments[pathSegments.length - 1];
    return PAGE_TITLES[last] ?? (last.charAt(0).toUpperCase() + last.slice(1));
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    setMenuOpen(false);
    router.push("/login");
  }

  function handleViewProfile() {
    setMenuOpen(false);
    router.push("/profile");
  }

  return (
    <header className="h-16 border-b border-border bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          className="lg:hidden p-2 rounded-lg text-ternary hover:bg-off-white hover:text-foreground transition-colors cursor-pointer shrink-0"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-bold text-foreground leading-tight truncate">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right: search + avatar */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="relative group hidden md:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ternary group-focus-within:text-primary transition-colors pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search leads, tasks..."
            className="pl-10 pr-4 py-2 bg-off-white border border-border rounded-xl text-sm w-56 lg:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Avatar + dropdown */}
        <div ref={menuRef} className="relative flex items-center gap-3 sm:pl-4 sm:border-l sm:border-border">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="w-8 h-8 rounded-full bg-primary border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
          >
            VM
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-50">
              {/* User info */}
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground truncate">Vivek Makwana</p>
                <p className="text-xs text-ternary truncate">admin@invennico.com</p>
              </div>

              {/* Options */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={handleViewProfile}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-off-white transition-colors cursor-pointer"
                >
                  <User size={15} className="text-ternary" />
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
