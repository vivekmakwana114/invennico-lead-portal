"use client";

import React, { useState, useRef } from "react";
import { Camera, Mail, Phone, Briefcase, MapPin, Building2, Calendar, Lock } from "lucide-react";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";
import Image from "next/image";

interface ProfileForm {
  name: string;
  email: string;
  role: string;
  phone: string;
  department: string;
  location: string;
}

const defaultProfile: ProfileForm = {
  name: "Vivek Makwana",
  email: "admin@invennico.com",
  role: "Admin",
  phone: "+1 (555) 000-0000",
  department: "Administrator", 
  location: "Ahmedabad, India",
};

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>(defaultProfile);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleChange(field: keyof ProfileForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  }

  function handleSave() {
    toast.success("Profile updated successfully.");
  }

  function handleUpdatePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-ternary mt-1">
          View and update your personal information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
        {/* Left: Avatar card */}
        <div className="border border-border rounded-xl bg-white p-6 flex flex-col items-center gap-4 text-center">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                getInitials(form.name)
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer"
            >
              <Camera size={13} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div>
            <p className="text-base font-bold text-foreground">{form.name}</p>
            <p className="text-sm text-ternary">{form.role}</p>
          </div>

          {/* Quick stats */}
          <div className="w-full border-t border-border pt-4 space-y-3 text-left">
            <div className="flex items-center gap-2.5 text-sm text-ternary">
              <Mail size={14} className="shrink-0" />
              <span className="truncate">{form.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-ternary">
              <Building2 size={14} className="shrink-0" />
              <span>{form.department}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-ternary">
              <MapPin size={14} className="shrink-0" />
              <span>{form.location}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-ternary">
              <Calendar size={14} className="shrink-0" />
              <span>Joined Jan 2025</span>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="border border-border rounded-xl bg-white p-6 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-foreground">Personal Information</h2>
            <p className="text-sm text-ternary mt-1">Update your profile details below</p>
          </div>

          {/* Name + Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Briefcase size={13} className="text-ternary" /> Role / Position
              </label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Mail size={13} className="text-ternary" /> Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Phone size={13} className="text-ternary" /> Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Department + Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Building2 size={13} className="text-ternary" /> Department
              </label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => handleChange("department", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <MapPin size={13} className="text-ternary" /> Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-base font-semibold text-foreground">Change Password</h2>
            </div>
            <p className="text-sm text-ternary -mt-3 mb-5">Update your account password for security</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleUpdatePassword}
                className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
