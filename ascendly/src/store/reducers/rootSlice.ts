import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Habit } from '@features/habits/types/habit';
import habitsData from '@features/habits/data/habits.json';

interface RootState {
  isLoaderVisible: boolean;
  habits: Habit[];
  loading: boolean;
  error: string | null;
  toastMessage: string | null;
  isDarkMode: boolean;
}

const initialState: RootState = {
  isLoaderVisible: false,
  habits: [],
  loading: false,
  error: null,
  toastMessage: null,
  isDarkMode: false,
};

// Async Thunk for fetching habits
export const fetchHabits = createAsyncThunk(
  'root/fetchHabits',
  async (isRefresh: boolean = false, { dispatch, rejectWithValue }) => {
    try {
      if (!isRefresh) dispatch(setLoaderVisible(true));
      
      // Simulate network delay
      await new Promise((resolve) => setTimeout(() => resolve(null), 1500));
      
      console.log('Fetched Habits Data:', habitsData);
      return habitsData as Habit[];
    } catch (error) {
      return rejectWithValue('Failed to fetch habits');
    } finally {
      if (!isRefresh) dispatch(setLoaderVisible(false));
    }
  }
);

// Async Thunk for adding a habit
export const addHabitAsync = createAsyncThunk(
  'root/addHabit',
  async (habit: Omit<Habit, 'id' | 'createdDate'>, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoaderVisible(true));
      // Simulate network delay
      await new Promise((resolve) => setTimeout(() => resolve(null), 1500));
      
      const newHabit: Habit = {
        ...habit,
        id: Math.floor(Math.random() * 1000000), // Simulate ID generation
        createdDate: new Date().toISOString(),
      } as Habit;
      
      console.log('✅ Habit Created Successfully:', newHabit);
      return newHabit;
    } catch (error) {
      return rejectWithValue('Failed to add habit');
    } finally {
      dispatch(setLoaderVisible(false));
    }
  }
);

// Async Thunk for updating a habit
export const updateHabitAsync = createAsyncThunk(
  'root/updateHabit',
  async (habit: Habit, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoaderVisible(true));
      // Simulate network delay
      await new Promise((resolve) => setTimeout(() => resolve(null), 1500));
      
      console.log('✨ Habit Updated Successfully:', habit);
      return habit;
    } catch (error) {
      return rejectWithValue('Failed to update habit');
    } finally {
      dispatch(setLoaderVisible(false));
    }
  }
);

// Async Thunk for deleting a habit
export const deleteHabitAsync = createAsyncThunk(
  'root/deleteHabit',
  async (habitId: number, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoaderVisible(true));
      // Simulate network delay
      await new Promise((resolve) => setTimeout(() => resolve(null), 1500));
      
      console.log('🗑️ Habit Deleted Successfully, ID:', habitId);
      return habitId;
    } catch (error) {
      return rejectWithValue('Failed to delete habit');
    } finally {
      dispatch(setLoaderVisible(false));
    }
  }
);

const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    setLoaderVisible: (state, action: PayloadAction<boolean>) => {
      state.isLoaderVisible = action.payload;
    },
    setHabits: (state, action: PayloadAction<Habit[]>) => {
      state.habits = action.payload;
    },
    setToast: (state, action: PayloadAction<string | null>) => {
      state.toastMessage = action.payload;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    updateHabit: (state, action: PayloadAction<Habit>) => {
      const index = state.habits.findIndex(h => h.id === action.payload.id);
      if (index !== -1) {
        state.habits[index] = action.payload;
      }
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action: PayloadAction<Habit[]>) => {
        state.loading = false;
        state.habits = action.payload;
        state.toastMessage = 'Habits updated successfully! ✅';
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addHabitAsync.fulfilled, (state, action: PayloadAction<Habit>) => {
        state.habits.push(action.payload);
        state.toastMessage = 'Habit created successfully! 🎯';
      })
      .addCase(updateHabitAsync.fulfilled, (state, action: PayloadAction<Habit>) => {
        const index = state.habits.findIndex(h => h.id === action.payload.id);
        if (index !== -1) {
          state.habits[index] = action.payload;
        }
        state.toastMessage = 'Habit updated successfully! ✨';
      })
      .addCase(deleteHabitAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.habits = state.habits.filter(h => h.id !== action.payload);
        state.toastMessage = 'Habit deleted successfully! 🗑️';
      });
  },
});

export const { setLoaderVisible, setHabits, setToast, toggleDarkMode, setDarkMode, updateHabit } = rootSlice.actions;
export default rootSlice.reducer;
