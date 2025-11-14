import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import leadReducer from "./slices/leadSlice";
import notificationReducer from "./slices/notificationSlice";
import analyticsReducer from "./slices/analyticsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadReducer,
    notifications: notificationReducer,
    analytics: analyticsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
