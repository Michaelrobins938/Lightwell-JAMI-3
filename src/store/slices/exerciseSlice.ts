import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ExerciseEntry {
  date: string;
  duration: number; // in seconds
}

interface ExerciseState {
  data: ExerciseEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: ExerciseState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchExerciseData = createAsyncThunk(
  'exercise/fetchExerciseData',
  async (_, { rejectWithValue }) => {
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/exercise');
      if (!response.ok) throw new Error('Failed to fetch exercise data');
      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return rejectWithValue(errorMessage);
    }
  }
);

const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExerciseData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExerciseData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchExerciseData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default exerciseSlice.reducer;