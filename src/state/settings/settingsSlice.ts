import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { settingsService, UpdateSettingsPayload } from "./settingsService";

interface SettingsState {
  settings: any | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveError: string | null;
  saveSuccess: boolean;
}

const initialState: SettingsState = {
  settings: null,
  isLoading: false,
  isSaving: false,
  error: null,
  saveError: null,
  saveSuccess: false,
};

export const fetchSettings = createAsyncThunk(
  "settings/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await settingsService.getSettings();
      return res.data?.data?.settings || null;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch settings"
      );
    }
  }
);

export const updateSettings = createAsyncThunk(
  "settings/update",
  async (payload: UpdateSettingsPayload, thunkAPI) => {
    try {
      const res = await settingsService.updateSettings(payload);
      return res.data?.data?.settings || null;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to save settings"
      );
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearSaveStatus: (state) => {
      state.saveError = null;
      state.saveSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateSettings.pending, (state) => {
        state.isSaving = true;
        state.saveError = null;
        state.saveSuccess = false;
      })
      .addCase(updateSettings.fulfilled, (state, action: PayloadAction<any>) => {
        state.isSaving = false;
        state.saveSuccess = true;
        state.settings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action: PayloadAction<any>) => {
        state.isSaving = false;
        state.saveError = action.payload;
      });
  },
});

export const { clearSaveStatus } = settingsSlice.actions;
export default settingsSlice.reducer;
