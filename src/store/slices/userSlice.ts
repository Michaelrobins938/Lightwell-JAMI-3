import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  data: {
    id: string;
    name: string;
    email: string;
    settings: {
      theme: 'light' | 'dark';
      notifications: boolean;
    };
  };
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: {
    id: '',
    name: '',
    email: '',
    settings: {
      theme: 'light',
      notifications: true,
    },
  },
  loading: false,
  error: null,
};

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/user');
      if (!response.ok) throw new Error('Failed to fetch user data');
      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUserSettings = createAsyncThunk(
  'user/updateUserSettings',
  async (settings: Partial<UserState['data']['settings']>, { rejectWithValue }) => {
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error('Failed to update user settings');
      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<UserState['data']>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserSettings.fulfilled, (state, action: PayloadAction<UserState['data']['settings']>) => {
        state.data.settings = action.payload;
      });
  },
});

export default userSlice.reducer;