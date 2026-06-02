"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/state/hooks";
import {
  fetchProfile,
  updateUserProfile,
  changeUserPassword,
  uploadUserAvatar,
} from "@/state/users/usersSlice";
import { BASE_URL } from "@/lib/api";

interface ProfileForm {
  name: string;
  email: string;
  role: string;
  phone: string;
  department: string;
  location: string;
}

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { profile, isLoading, actionLoading } = useAppSelector(
    (state) => state.users,
  );

  const [form, setForm] = useState<ProfileForm>({
    name: "",
    email: "",
    role: "",
    phone: "",
    department: "",
    location: "",
  });
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        role: profile.role || "",
        phone: profile.phone || "",
        department: profile.department || "",
        location: profile.location || "",
      });
    }
  }, [profile]);

  function handleChange(field: keyof ProfileForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (pendingFile) {
      const avatarResult = await dispatch(uploadUserAvatar(pendingFile));
      if (uploadUserAvatar.rejected.match(avatarResult)) {
        toast.error(
          (avatarResult.payload as string) || "Failed to upload avatar.",
        );
        return;
      }
      setPendingFile(null);
      setPendingPreview(null);
    }

    const result = await dispatch(
      updateUserProfile({
        name: form.name,
        phone: form.phone || null,
        department: form.department || null,
        location: form.location || null,
      }),
    );
    if (updateUserProfile.fulfilled.match(result)) {
      toast.success("Profile updated successfully.");
    } else {
      toast.error((result.payload as string) || "Failed to update profile.");
    }
  }

  async function handleUpdatePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    const result = await dispatch(
      changeUserPassword({ currentPassword, newPassword }),
    );
    if (changeUserPassword.fulfilled.match(result)) {
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error((result.payload as string) || "Failed to update password.");
    }
  }

  const savedAvatarUrl = profile?.avatar
    ? `${BASE_URL}${profile.avatar}`
    : null;
  const displayAvatar = pendingPreview || savedAvatarUrl;

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  const displayRole = form.role
    ? form.role.charAt(0).toUpperCase() + form.role.slice(1)
    : "";

  if (isLoading && !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
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
              {displayAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayAvatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(form.name || "U")
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
            <p className="text-sm text-ternary">{displayRole}</p>
          </div>

          {/* Quick stats */}
          <div className="w-full border-t border-border pt-4 space-y-3 text-left">
            <div className="flex items-center gap-2.5 text-sm text-ternary">
              <Mail size={14} className="shrink-0" />
              <span>{form.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-ternary">
              <Building2 size={14} className="shrink-0" />
              <span>{form.department || "—"}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-ternary">
              <MapPin size={14} className="shrink-0" />
              <span>{form.location || "—"}</span>
            </div>
            {joinedDate && (
              <div className="flex items-center gap-2.5 text-sm text-ternary">
                <Calendar size={14} className="shrink-0" />
                <span>Joined {joinedDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Form */}
        <div className="border border-border rounded-xl bg-white p-6 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Personal Information
            </h2>
            <p className="text-sm text-ternary mt-1">
              Update your profile details below
            </p>
          </div>

          {/* Name + Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Briefcase size={13} className="text-ternary" /> Role
              </label>
              <input
                type="text"
                value={displayRole}
                readOnly
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-gray-50 text-ternary cursor-not-allowed"
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
                readOnly
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-gray-50 text-ternary cursor-not-allowed"
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
              disabled={actionLoading}
              className="px-5 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {actionLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Change Password */}
          <div className="border-t border-border pt-6">
            <h2 className="text-base font-semibold text-foreground mb-1">
              Change Password
            </h2>
            <p className="text-sm text-ternary mb-5">
              Update your account password for security
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-9 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-ternary hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-9 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-ternary hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-9 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-ternary hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleUpdatePassword}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {actionLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
