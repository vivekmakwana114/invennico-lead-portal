import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import usersReducer from "./users/usersSlice";
import leadsReducer from "./leads/leadsSlice";
import settingsReducer from "./settings/settingsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    leads: leadsReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents warning issues with non-serializable headers or custom date fields
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
