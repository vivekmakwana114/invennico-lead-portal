"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { loginUser, resetStatus } from "@/state/auth/authSlice";

/**
 * LoginPage with validation and feedback.
 * Validates email and password against brand-specific criteria.
 */
export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, error: authError, tokens, user } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const isLoading = status === "loading";

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (tokens && user) {
      router.replace("/dashboard");
    }
  }, [tokens, user, router]);

  // Reset auth status on mount
  useEffect(() => {
    dispatch(resetStatus());
  }, [dispatch]);

  // Validation Logic
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const isEmailValid = useMemo(() => emailRegex.test(email), [email]);
  const isPasswordValid = useMemo(() => passwordRegex.test(password), [password]);
  const isFormValid = isEmailValid && isPasswordValid;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const resultAction = await dispatch(
        loginUser({ identifier: email, password, rememberMe })
      );

      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("Welcome back! Login Successful.", {
          description: "You are being redirected to your dashboard.",
          duration: 3000,
        });
      } else {
        const errorMsg =
          (resultAction.payload as any)?.message ||
          (resultAction.payload as string) ||
          "Invalid email or password. Please try again.";

        toast.error("Access Denied", {
          description: errorMsg,
          className: "bg-error-bg text-error-text border-error-border",
        });
      }
    } catch (err: any) {
      toast.error("Access Denied", {
        description: "An unexpected error occurred. Please try again.",
        className: "bg-error-bg text-error-text border-error-border",
      });
    }
  };

  return (
    <div className="bg-off-white flex items-center justify-center p-6 sm:p-10 md:p-12 h-full min-h-screen">
      <div className="w-full max-w-md my-auto py-4">
        {/* Mobile Logo (Visible only on md:hidden) */}
        <div className="md:hidden flex items-center gap-2 mb-8">
          <div className="w-10 h-10 glass rounded-lg flex items-center justify-center shadow-md">
            <Image 
              src="/assets/logo/Invennico.svg" 
              alt="Invennico Logo" 
              width={24} 
              height={24}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight text-gray-900">Invennico</h2>
            <p className="text-gray-500 text-[10px] font-medium uppercase tracking-wider">Lead Portal</p>
          </div>
        </div>

        <div className="mb-6 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 leading-tight">Welcome back</h2>
          <p className="text-gray-500 text-sm sm:text-base font-medium">Sign in to access the lead portal</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="">
            <label className="text-xs sm:text-sm font-semibold text-gray-700 block uppercase tracking-wide mb-1">
              Email address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors">
                <Image 
                  src="/assets/icons/email.svg" 
                  alt="Email" 
                  width={20} 
                  height={20} 
                  className={`transition-opacity ${email ? 'opacity-100' : 'opacity-40'}`}
                />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@invennico.com"
                className={`block w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border rounded-xl outline-none transition-all placeholder:text-gray-400 bg-background text-sm sm:text-base ${
                  email && !isEmailValid ? 'border-error-border focus:ring-error-bg' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                }`}
                required
              />
            </div>
              <p className={`text-sm text-error-text mb-2 mt-2 font-medium ml-1 transition-opacity duration-200 ${email && !isEmailValid ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                Please enter a valid email address
              </p>
          </div>

          <div className="">
            <label className="text-xs sm:text-sm font-semibold text-gray-700 block uppercase tracking-wide mb-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors">
                <Image 
                  src="/assets/icons/lock.svg" 
                  alt="Lock" 
                  width={20} 
                  height={20} 
                  className={`transition-opacity ${password ? 'opacity-100' : 'opacity-40'}`}
                />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`block w-full pl-10 sm:pl-11 pr-12 py-2.5 sm:py-3 border rounded-xl outline-none transition-all placeholder:text-gray-400 bg-background text-sm sm:text-base ${
                  password && !isPasswordValid ? 'border-error-border focus:ring-error-bg' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
           
              <p className={`text-sm text-error-text mb-2 mt-2 font-medium leading-tight ml-1 transition-opacity duration-200 ${password && !isPasswordValid ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                Must be 8+ characters with uppercase, number & special character
              </p>
           
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative w-4 h-4 sm:w-5 sm:h-5 shrink-0">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer absolute opacity-0 w-full h-full cursor-pointer"
                />
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded peer-checked:bg-primary peer-checked:border-primary transition-all duration-200" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity duration-200">
                  <div className="w-1 h-2 sm:w-1.5 sm:h-3 border-r-2 border-b-2 border-white rotate-45 mb-1" />
                </div>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
            </label>
            <Link href="/forgot-password" flex-shrink-0="true" className="text-xs sm:text-sm font-bold text-primary hover:text-primary transition-colors whitespace-nowrap">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            label={isLoading ? "Signing in..." : "Sign in to Portal"}
            variant="primary"
            disabled={!isFormValid || isLoading}
            icon={!isLoading && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 group-hover:translate-x-1 transition-transform" />}
            iconPlacement="right"
            className="bg-brand-gradient w-full py-3 sm:py-3.5 text-base sm:text-lg mt-2"
          />
        </form>        
        <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-[10px] sm:text-xs md:text-sm font-medium text-gray-500">
           <div className="w-4 h-4 sm:w-5 sm:h-5 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
             <Image 
                src="/assets/icons/lock.svg" 
                alt="Authorized" 
                width={14} 
                height={14} 
             />
           </div>
           <span className="text-center">Authorized Invennico Team Access Only</span>
        </div>
      </div>
    </div>
  );
}
