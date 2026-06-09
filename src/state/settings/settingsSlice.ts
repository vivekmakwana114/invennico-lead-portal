/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { settingsService, UpdateSettingsPayload } from "./settingsService";

interface SettingsState {
  settings: any | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveError: string | null;
  saveSuccess: boolean;
  // AI Prompt
  aiPrompt: string;
  promptLoading: boolean;
  promptSaving: boolean;
  promptSaveSuccess: boolean;
  promptSaveError: string | null;
}

const initialState: SettingsState = {
  settings: null,
  isLoading: false,
  isSaving: false,
  error: null,
  saveError: null,
  saveSuccess: false,
  // AI Prompt
  aiPrompt: "",
  promptLoading: false,
  promptSaving: false,
  promptSaveSuccess: false,
  promptSaveError: null,
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

export const fetchPrompt = createAsyncThunk(
  "settings/fetchPrompt",
  async (_, thunkAPI) => {
    try {
      const res = await settingsService.getPrompt();
      return (res.data?.data?.aiPrompt as string) ?? "";
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch prompt"
      );
    }
  }
);

export const savePrompt = createAsyncThunk(
  "settings/savePrompt",
  async (aiPrompt: string, thunkAPI) => {
    try {
      const res = await settingsService.updatePrompt(aiPrompt);
      return (res.data?.data?.aiPrompt as string) ?? "";
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to save prompt"
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
    clearPromptStatus: (state) => {
      state.promptSaveSuccess = false;
      state.promptSaveError = null;
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
      })

      .addCase(fetchPrompt.pending, (state) => {
        state.promptLoading = true;
      })
      .addCase(fetchPrompt.fulfilled, (state, action: PayloadAction<string>) => {
        state.promptLoading = false;
        state.aiPrompt = action.payload;
      })
      .addCase(fetchPrompt.rejected, (state) => {
        state.promptLoading = false;
      })

      .addCase(savePrompt.pending, (state) => {
        state.promptSaving = true;
        state.promptSaveSuccess = false;
        state.promptSaveError = null;
      })
      .addCase(savePrompt.fulfilled, (state, action: PayloadAction<string>) => {
        state.promptSaving = false;
        state.promptSaveSuccess = true;
        state.aiPrompt = action.payload;
      })
      .addCase(savePrompt.rejected, (state, action: PayloadAction<any>) => {
        state.promptSaving = false;
        state.promptSaveError = action.payload;
      });
  },
});

export const { clearSaveStatus, clearPromptStatus } = settingsSlice.actions;
export default settingsSlice.reducer;
