/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";

// login api
export const login = (credentials: any) => {
  return api.post(`/v1/auth/login`, credentials);
};

// forgot password api
export const forgotPassword = (email: string) => {
  return api.post(`/v1/auth/forgot/password`, { email });
};

// verify OTP api
export const verifyOtpApi = ({ email, otp }: { email: string; otp: string }) => {
  return api.post(`/v1/auth/verify/otp`, { email, otp });
};

// Reset password using token and new password
export const resetPassword = ({ token, password }: any) => {
  return api.post(`/v1/auth/reset/password?token=${encodeURIComponent(token)}`, { password });
};
