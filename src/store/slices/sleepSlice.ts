import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface SleepEntry {
  date: string;
  duration: number; // in seconds
}

interface SleepState {
  data: SleepEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: SleepState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchSleepData = createAsyncThunk(
  'sleep/fetchSleepData',
  async (_, { rejectWithValue }) => {
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/sleep');
      if (!response.ok) throw new Error('Failed to fetch sleep data');
      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return rejectWithValue(errorMessage);
    }
  }
);

const sleepSlice = createSlice({
  name: 'sleep',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSleepData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSleepData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSleepData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default sleepSlice.reducer;