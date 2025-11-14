import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch leads
export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/leads?${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch single lead
export const fetchLeadById = createAsyncThunk(
  "leads/fetchLeadById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/leads/${id}`);
      return response.data.lead;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create lead
export const createLead = createAsyncThunk(
  "leads/createLead",
  async (leadData, { rejectWithValue }) => {
    try {
      const response = await api.post("/leads", leadData);
      return response.data.lead;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update lead
export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/leads/${id}`, data);
      return response.data.lead;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete lead
export const deleteLead = createAsyncThunk(
  "leads/deleteLead",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/leads/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  leads: [],
  currentLead: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
    limit: 10
  },
  loading: false,
  error: null
};

const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    clearCurrentLead: (state) => {
      state.currentLead = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch leads
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.leads;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single lead
      .addCase(fetchLeadById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLead = action.payload;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create lead
      .addCase(createLead.fulfilled, (state, action) => {
        state.leads.unshift(action.payload);
      })
      // Update lead
      .addCase(updateLead.fulfilled, (state, action) => {
        const index = state.leads.findIndex(
          (lead) => lead.id === action.payload.id
        );
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
        if (state.currentLead?.id === action.payload.id) {
          state.currentLead = action.payload;
        }
      })
      // Delete lead
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.leads = state.leads.filter((lead) => lead.id !== action.payload);
      });
  }
});

export const { clearCurrentLead, clearError } = leadSlice.actions;
export default leadSlice.reducer;
