"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

/**
 * ForgotPasswordPage - A 3-step workflow for password recovery.
 * Uses Step-wise state to guide the user through Email, OTP, and Reset.
 */
export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Validation Logic
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const isEmailValid = useMemo(() => emailRegex.test(email), [email]);
  const isOtpValid = otp.every((digit) => digit.length === 1);
  const isPasswordValid = passwordRegex.test(newPassword);
  const doPasswordsMatch = newPassword === confirmPassword && newPassword !== "";

  // Timer logic for Step 2
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      setTimer(15);
      toast.info("OTP Sent!", { description: `Check your email: ${email}` });
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
      toast.success("OTP Verified successfully.");
    }, 1000);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid || !doPasswordsMatch) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password Reset Successful", { 
        description: "Your password has been updated. Please sign in with your new password." 
      });
      // Redirect to login will happen naturally if the user clicks a button, 
      // but here we show a success state or just redirect.
      setStep(4);
    }, 1500);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleResendOtp = () => {
    if (timer > 0) return;
    setTimer(15);
    toast.info("A new OTP has been sent to your email.");
  };

  // ---------------------------------------------------------
  // Render Helpers
  // ---------------------------------------------------------

  const renderStepHeader = (title: string, sub: string) => (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 font-medium">{sub}</p>
    </div>
  );

  return (
    <div className="flex items-center justify-center p-6 sm:p-10 md:p-12 min-h-screen bg-off-white">
      <div className="w-full max-w-md">
        {/* Navigation */}
        {step < 4 && (
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Login
          </Link>
        )}

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {renderStepHeader("Forgot Password?", "Enter your email for a 6-digit code.")}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-700 uppercase font-bold tracking-widest">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Image src="/assets/icons/email.svg" alt="Email" width={20} height={20} className="opacity-60" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@invennico.com"
                    className="block w-full pl-11 pr-4 py-3 bg-background border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                label={isLoading ? "Sending..." : "Send Verification Code"}
                variant="primary"
                disabled={!isEmailValid || isLoading}
                className="w-full py-4 text-lg bg-brand-gradient"
                icon={!isLoading && <ArrowRight className="w-5 h-5" />}
                iconPlacement="right"
              />
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            {renderStepHeader("Verify Code", `We've sent a 6-digit code to ${email}`)}
            <div className="space-y-8">
              <div className="flex justify-between gap-2 sm:gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !digit && i > 0) {
                        document.getElementById(`otp-${i - 1}`)?.focus();
                      }
                    }}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-background border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                ))}
              </div>

              <div className="flex flex-col items-center gap-4">
                <Button
                  type="submit"
                  label={isLoading ? "Verifying..." : "Verify & Continue"}
                  variant="primary"
                  disabled={!isOtpValid || isLoading}
                  className="w-full py-4 text-lg bg-brand-gradient"
                />
                
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timer > 0}
                  className={`inline-flex items-center gap-2 text-sm font-bold transition-colors ${
                    timer > 0 ? "text-gray-300 cursor-not-allowed" : "text-primary hover:text-primary/80"
                  }`}
                >
                  <RotateCcw className={`w-4 h-4 ${timer > 0 ? "" : "animate-spin-once"}`} />
                  {timer > 0 ? `Resend Code in ${timer}s` : "Resend Verification Code"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step 3: Password Reset */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            {renderStepHeader("Set New Password", "Create a secure password.")}
            <div className="space-y-2">
              <div>
                <label className="text-sm font-bold text-gray-700 uppercase tracking-widest">New Password</label>
                <div className="relative group">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full px-4 pr-12 py-3 bg-background border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
  
                  <p className={`text-sm text-error-text mt-2 mb-2 font-medium leading-relaxed transition-opacity duration-200 ${newPassword && !isPasswordValid ? 'opacity-100' : 'opacity-0'}`}>
                    Must be 8+ characters with uppercase, number & special char
                  </p>
                
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 uppercase tracking-widest">Confirm Password</label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`block w-full px-4 pr-12 py-3 bg-background border rounded-xl outline-none transition-all ${
                       confirmPassword && !doPasswordsMatch ? "border-error-border" : "border-gray-200 focus:ring-2 focus:ring-primary/10 focus:border-primary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
               
                  <p className={`text-sm text-error-text mt-2 mb-2 font-medium transition-opacity duration-200 ${confirmPassword && !doPasswordsMatch ? 'opacity-100' : 'opacity-0'}`}>
                    Passwords do not match
                  </p>
               
              </div>

              <Button
                type="submit"
                label={isLoading ? "Updating..." : "Update Password"}
                variant="primary"
                disabled={!isPasswordValid || !doPasswordsMatch || isLoading}
                className="w-full py-4 text-lg bg-brand-gradient"
              />
            </div>
          </form>
        )}

        {/* Step 4: Success State */}
        {step === 4 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">All set!</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Your password has been successfully reset. You can now use your new credentials to access the portal.
            </p>
            <Link href="/login" className="block w-full">
               <Button label="Back to Login" variant="primary" className="w-full py-4 text-lg bg-brand-gradient" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
