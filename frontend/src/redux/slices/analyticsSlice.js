import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch dashboard analytics
export const fetchDashboardAnalytics = createAsyncThunk(
  "analytics/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/analytics/dashboard");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch team performance
export const fetchTeamPerformance = createAsyncThunk(
  "analytics/fetchTeamPerformance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/analytics/team-performance");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  dashboardData: null,
  teamPerformance: [],
  loading: false,
  error: null
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.dashboardData = null;
      state.teamPerformance = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch team performance
      .addCase(fetchTeamPerformance.fulfilled, (state, action) => {
        state.teamPerformance = action.payload;
      });
  }
});

export const { clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
