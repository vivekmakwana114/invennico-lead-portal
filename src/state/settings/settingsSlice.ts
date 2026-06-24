/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { settingsService, UpdateSettingsPayload, AiPrompts } from "./settingsService";

const EMPTY_AI_PROMPTS: AiPrompts = {
  leadAnalysis: "",
  whatsappFirst: "",
  whatsappRegen: "",
  geminiResearch: "",
  proposal: "",
};

interface SettingsState {
  settings: any | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveError: string | null;
  saveSuccess: boolean;
  // AI Prompts
  aiPrompts: AiPrompts;
  promptLoading: boolean;
  // Per-key save state — only one section saves at a time
  promptSavingKey: keyof AiPrompts | null;
  promptSaveSuccessKey: keyof AiPrompts | null;
  promptSaveErrorKey: keyof AiPrompts | null;
  promptSaveError: string | null;
}

const initialState: SettingsState = {
  settings: null,
  isLoading: false,
  isSaving: false,
  error: null,
  saveError: null,
  saveSuccess: false,
  aiPrompts: EMPTY_AI_PROMPTS,
  promptLoading: false,
  promptSavingKey: null,
  promptSaveSuccessKey: null,
  promptSaveErrorKey: null,
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
      return (res.data?.data?.aiPrompts as AiPrompts) ?? EMPTY_AI_PROMPTS;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch prompts"
      );
    }
  }
);

export const saveSinglePrompt = createAsyncThunk(
  "settings/saveSinglePrompt",
  async ({ key, value }: { key: keyof AiPrompts; value: string }, thunkAPI) => {
    try {
      await settingsService.updateSinglePrompt(key, value);
      return { key, value };
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        key,
        message: error.response?.data?.message || error.message || "Failed to save prompt",
      });
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
      state.promptSaveSuccessKey = null;
      state.promptSaveErrorKey = null;
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
      .addCase(fetchPrompt.fulfilled, (state, action: PayloadAction<AiPrompts>) => {
        state.promptLoading = false;
        state.aiPrompts = action.payload;
      })
      .addCase(fetchPrompt.rejected, (state) => {
        state.promptLoading = false;
      })

      .addCase(saveSinglePrompt.pending, (state, action) => {
        state.promptSavingKey = action.meta.arg.key;
        state.promptSaveSuccessKey = null;
        state.promptSaveErrorKey = null;
        state.promptSaveError = null;
      })
      .addCase(saveSinglePrompt.fulfilled, (state, action) => {
        const { key, value } = action.payload;
        state.promptSavingKey = null;
        state.promptSaveSuccessKey = key;
        state.aiPrompts[key] = value;
      })
      .addCase(saveSinglePrompt.rejected, (state, action: PayloadAction<any>) => {
        state.promptSavingKey = null;
        state.promptSaveErrorKey = action.payload?.key ?? null;
        state.promptSaveError = action.payload?.message ?? "Failed to save";
      });
  },
});

export const { clearSaveStatus, clearPromptStatus } = settingsSlice.actions;
export default settingsSlice.reducer;
