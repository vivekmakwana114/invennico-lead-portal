import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  usersService,
  UpdateProfilePayload,
  ChangePasswordPayload,
  CreateUserPayload,
  UpdateUserPayload,
  GetUsersParams,
} from "./usersService";

interface UsersState {
  usersList: any[];
  profile: any | null;
  isLoading: boolean;
  actionLoading: boolean;
  error: string | null;
  actionError: string | null;
}

const initialState: UsersState = {
  usersList: [],
  profile: null,
  isLoading: false,
  actionLoading: false,
  error: null,
  actionError: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (params: GetUsersParams | undefined, thunkAPI) => {
    try {
      const res = await usersService.getUsers(params);
      return res.data?.data?.results || [];
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
      return res.data?.data?.user || null;
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
      return res.data?.data?.user || null;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update profile"
      );
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "users/changePassword",
  async (payload: ChangePasswordPayload, thunkAPI) => {
    try {
      const res = await usersService.changePassword(payload);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to change password"
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "users/create",
  async (payload: CreateUserPayload, thunkAPI) => {
    try {
      const res = await usersService.createUser(payload);
      return res.data?.data?.user || null;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to create user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ userId, payload }: { userId: string; payload: UpdateUserPayload }, thunkAPI) => {
    try {
      const res = await usersService.updateUser(userId, payload);
      return res.data?.data?.user || null;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update user"
      );
    }
  }
);

export const uploadUserAvatar = createAsyncThunk(
  "users/uploadAvatar",
  async (file: File, thunkAPI) => {
    try {
      const res = await usersService.uploadAvatar(file);
      return res.data?.data?.user || null;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to upload avatar"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (userId: string, thunkAPI) => {
    try {
      await usersService.deleteUser(userId);
      return userId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete user"
      );
    }
  }
);

export const grantUserCredits = createAsyncThunk(
  "users/grantCredits",
  async ({ userId, amount, note }: { userId: string; amount: number; note?: string }, thunkAPI) => {
    try {
      const res = await usersService.grantCredits(userId, amount, note);
      return res.data?.data?.user || null;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to grant credits"
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
      state.actionError = null;
      state.isLoading = false;
      state.actionLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.isLoading = false;
        state.usersList = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // changeUserPassword
      .addCase(changeUserPassword.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(changeUserPassword.rejected, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // uploadUserAvatar
      .addCase(uploadUserAvatar.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.profile = action.payload;
      })
      .addCase(uploadUserAvatar.rejected, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // createUser
      .addCase(createUser.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        if (action.payload) {
          state.usersList = [...state.usersList, action.payload];
        }
      })
      .addCase(createUser.rejected, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        if (action.payload) {
          state.usersList = state.usersList.map((u) =>
            u.id === action.payload.id ? action.payload : u
          );
        }
      })
      .addCase(updateUser.rejected, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // grantUserCredits
      .addCase(grantUserCredits.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(grantUserCredits.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        if (action.payload) {
          state.usersList = state.usersList.map((u) =>
            u.id === action.payload.id ? action.payload : u
          );
        }
      })
      .addCase(grantUserCredits.rejected, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.actionLoading = false;
        state.usersList = state.usersList.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  },
});

export const { clearUsersState } = usersSlice.actions;
export default usersSlice.reducer;
