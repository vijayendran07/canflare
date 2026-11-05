import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { healthApi } from '../../api/healthApi';

export const checkBackendHealth = createAsyncThunk(
  'health/checkBackendHealth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await healthApi.getHealth();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to connect to backend server');
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  lastChecked: null,
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    clearHealthStatus: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkBackendHealth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkBackendHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastChecked = new Date().toLocaleTimeString();
        state.error = null;
      })
      .addCase(checkBackendHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastChecked = new Date().toLocaleTimeString();
      });
  },
});

export const { clearHealthStatus } = healthSlice.actions;
export default healthSlice.reducer;

