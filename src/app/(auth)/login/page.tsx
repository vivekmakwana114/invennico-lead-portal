import React from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center p-6 sm:p-10 md:p-12 h-full min-h-screen">
      <div className="w-full max-w-md my-auto py-4">
        {/* Mobile Logo (Visible only on md:hidden) */}
        <div className="md:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center shadow-md">
            <div className="w-3 h-3 border-r-[2.5px] border-b-[2.5px] border-white rotate-45 mb-0.5" />
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

        <form className="space-y-4 sm:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-700 block uppercase tracking-wide">Email address</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="admin@invennico.com"
                  className="block w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 bg-gray-50/50 text-sm sm:text-base"
                />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-700 block uppercase tracking-wide">Password</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="block w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 bg-gray-50/50 text-sm sm:text-base"
                />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative w-4 h-4 sm:w-5 sm:h-5 shrink-0">
                <input type="checkbox" className="peer absolute opacity-0 w-full h-full cursor-pointer" />
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
            label="Sign in to Portal"
            variant="primary"
            icon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 group-hover:translate-x-1 transition-transform" />}
            iconPlacement="right"
            className="w-full py-3.5 sm:py-4 text-base sm:text-lg"
          />
        </form>

        <div className="mt-6 sm:mt-8 flex items-center gap-4 text-gray-400">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap">Or continue with</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <button className="w-full mt-6 sm:mt-8 bg-white border border-gray-200 text-gray-700 py-2.5 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.99]">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 1.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
        
        <div className="mt-8 sm:mt-12 flex items-center justify-center gap-2 text-[10px] sm:text-xs md:text-sm font-medium text-gray-500">
           <div className="w-4 h-4 sm:w-5 sm:h-5 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
              <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600" />
           </div>
           <span className="text-center">Authorized Invennico Team Access Only</span>
        </div>
      </div>
    </div>
  );
}
