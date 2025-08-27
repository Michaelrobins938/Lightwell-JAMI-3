import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface MoodEntry {
  date: string;
  score: number;
}

interface MoodState {
  data: MoodEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: MoodState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchMoodData = createAsyncThunk(
  'mood/fetchMoodData',
  async (_, { rejectWithValue }) => {
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/mood');
      if (!response.ok) throw new Error('Failed to fetch mood data');
      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return rejectWithValue(errorMessage);
    }
  }
);

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoodData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoodData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMoodData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default moodSlice.reducer;