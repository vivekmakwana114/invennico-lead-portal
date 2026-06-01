import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { usersService, UpdateProfilePayload } from "./usersService";

interface UsersState {
  usersList: any[];
  profile: any | null;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UsersState = {
  usersList: [],
  profile: null,
  isLoading: false,
  error: null,
  success: false,
};

// Async Thunks
export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await usersService.getUsers();
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch users"
      );
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "users/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const res = await usersService.getProfile();
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "users/updateProfile",
  async (payload: UpdateProfilePayload, thunkAPI) => {
    try {
      const res = await usersService.updateProfile(payload);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update profile"
      );
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsersState: (state) => {
      state.error = null;
      state.success = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.isLoading = false;
        state.success = true;
        state.usersList = action.payload || [];
      })
      .addCase(fetchUsers.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.success = true;
        state.profile = action.payload || null;
      })
      .addCase(fetchProfile.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.success = true;
        state.profile = action.payload || state.profile;
      })
      .addCase(updateUserProfile.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearUsersState } = usersSlice.actions;
export default usersSlice.reducer;
