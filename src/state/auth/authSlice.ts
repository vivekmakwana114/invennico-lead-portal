import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  forgotPassword,
  verifyOtpApi,
  resetPassword as resetPasswordApi,
} from "./authService";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ identifier, password, rememberMe }: any, { rejectWithValue }) => {
    try {
      const res = await login({ email: identifier, password });

      // Return both data and the rememberMe flag
      return { ...res.data, rememberMe };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || {
          message: err.message || "Something went wrong",
        },
      );
    }
  },
);

export const sendForgotPassword = createAsyncThunk(
  "auth/sendForgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await forgotPassword(email);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || {
          message: err.message || "Something went wrong",
        },
      );
    }
  },
);

// Verify OTP
export const performVerifyOtp = createAsyncThunk(
  "auth/performVerifyOtp",
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const res = await verifyOtpApi({ email, otp });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || {
          message: err.message || "Failed to verify OTP",
        },
      );
    }
  },
);

// Perform password reset using token
export const performResetPassword = createAsyncThunk(
  "auth/performResetPassword",
  async ({ token, password }: any, { rejectWithValue }) => {
    try {
      const res = await resetPasswordApi({ token, password });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || {
          message: err.message || "Failed to reset password",
        },
      );
    }
  },
);

const getInitialState = () => {
  if (typeof window !== "undefined") {
    try {
      // Check localStorage first, then sessionStorage
      const raw =
        localStorage.getItem("auth") || sessionStorage.getItem("auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...{
            user: null,
            tokens: null,
            role: null,
            redirect: null,
            status: "idle",
            error: null,
            forgotPasswordMessage: null,
            verifyOtpStatus: "idle",
            verifyOtpMessage: null,
            resetStatus: "idle",
            resetMessage: null,
          },
          ...parsed,
        };
      }
    } catch (_) {}
  }
  return {
    user: null,
    tokens: null,
    role: null,
    redirect: null,
    status: "idle",
    error: null,
    forgotPasswordMessage: null,
    verifyOtpStatus: "idle",
    verifyOtpMessage: null,
    resetStatus: "idle",
    resetMessage: null,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setUserRole: (state, action) => {
      state.role = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.role = null;
      state.status = "idle";
      state.error = null;
      state.forgotPasswordMessage = null;
      state.verifyOtpStatus = "idle";
      state.verifyOtpMessage = null;
      state.resetStatus = "idle";
      state.resetMessage = null;
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("auth");
          sessionStorage.removeItem("auth");
        } catch (_) {}
      }
    },
    updateUserAuthData: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof window !== "undefined") {
          try {
            const authData = JSON.stringify({
              user: state.user,
              tokens: state.tokens,
            });
            if (localStorage.getItem("auth")) {
              localStorage.setItem("auth", authData);
            } else if (sessionStorage.getItem("auth")) {
              sessionStorage.setItem("auth", authData);
            }
          } catch (_) {}
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.forgotPasswordMessage = null;
      state.verifyOtpStatus = "idle";
      state.verifyOtpMessage = null;
      state.resetStatus = "idle";
      state.resetMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login reducers
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Destructure rememberMe out, keep the rest as data
        const { rememberMe, ...payloadData } = action.payload;

        // API response structure: { success, message, data: { user, token } }
        // We need to extract from payloadData.data
        const responseData = payloadData.data || payloadData || {};

        state.user = responseData.user;
        state.tokens = responseData.token || responseData.tokens; // API returns 'token', we store as 'tokens'

        if (typeof window !== "undefined") {
          try {
            const authData = JSON.stringify({
              user: state.user,
              tokens: state.tokens,
            });

            if (rememberMe) {
              localStorage.setItem("auth", authData);
              sessionStorage.removeItem("auth"); // Clear session if exists
            } else {
              sessionStorage.setItem("auth", authData);
              localStorage.removeItem("auth"); // Clear local if exists
            }
          } catch (_) {}
        }
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload?.message || "Login failed";
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("auth");
            sessionStorage.removeItem("auth");
          } catch (_) {}
        }
      })

      // forgot password reducers
      .addCase(sendForgotPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.forgotPasswordMessage = null;
      })
      .addCase(sendForgotPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.forgotPasswordMessage =
          action.payload?.message || "Reset link sent";
      })
      .addCase(sendForgotPassword.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to send reset link";
        state.forgotPasswordMessage = null;
      })

      // verify otp reducers
      .addCase(performVerifyOtp.pending, (state) => {
        state.verifyOtpStatus = "loading";
        state.error = null;
        state.verifyOtpMessage = null;
      })
      .addCase(performVerifyOtp.fulfilled, (state, action) => {
        state.verifyOtpStatus = "succeeded";
        state.verifyOtpMessage = action.payload?.message || "OTP verified successfully";
      })
      .addCase(performVerifyOtp.rejected, (state, action: any) => {
        state.verifyOtpStatus = "failed";
        state.error = action.payload?.message || "Failed to verify OTP";
        state.verifyOtpMessage = null;
      })

      // perform reset password reducers
      .addCase(performResetPassword.pending, (state) => {
        state.resetStatus = "loading";
        state.resetMessage = null;
        state.error = null;
      })
      .addCase(performResetPassword.fulfilled, (state, action) => {
        state.resetStatus = "succeeded";
        state.resetMessage =
          action.payload?.message || "Password reset successfully";
      })
      .addCase(performResetPassword.rejected, (state, action: any) => {
        state.resetStatus = "failed";
        state.error = action.payload?.message || "Failed to reset password";
      });
  },
});

export const { setUserRole, logout, updateUserAuthData, clearError, resetStatus } = authSlice.actions;
export default authSlice.reducer;
