import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Habit } from '@features/habits/types/habit';

import { UserProfile, getUserHabits, addHabit, updateHabit as updateHabitFirestore, deleteHabit as deleteHabitFirestore } from '@core/firebase/firestore';

interface RootState {
  isLoaderVisible: boolean;
  habits: Habit[];
  loading: boolean;
  error: string | null;
  toastMessage: string | null;
  isDarkMode: boolean;
  user: UserProfile | null;
  isAuthenticated: boolean;
}

const initialState: RootState = {
  isLoaderVisible: false,
  habits: [],
  loading: false,
  error: null,
  toastMessage: null,
  isDarkMode: false,
  user: null,
  isAuthenticated: false,
};

// Async Thunk for fetching habits
export const fetchHabits = createAsyncThunk(
  'root/fetchHabits',
  async (isRefresh: boolean = false, { dispatch, getState, rejectWithValue }) => {
    try {
      if (!isRefresh) dispatch(setLoaderVisible(true));
      
      const state = getState() as any;
      const uid = state.root.user?.uid;
      
      if (!uid) {
        console.warn('Fetch Habits: No UID found in state');
        return [];
      }

      const habits = await getUserHabits(uid);
      
      console.log(`Fetched ${habits.length} habits from Firestore`);
      return habits as unknown as Habit[];
    } catch (error) {
      console.error('Fetch Habits Error:', error);
      return rejectWithValue('Failed to fetch habits');
    } finally {
      if (!isRefresh) dispatch(setLoaderVisible(false));
    }
  }
);

// Async Thunk for adding a habit
export const addHabitAsync = createAsyncThunk(
  'root/addHabit',
  async (habit: Omit<Habit, 'id' | 'createdDate'>, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoaderVisible(true));
      
      const state = getState() as any;
      const uid = state.root.user?.uid;
      
      if (!uid) throw new Error('No user authenticated');

      const result = await addHabit(uid, {
        ...habit,
        createdDate: new Date().toISOString(),
      });
      
      console.log('✅ Habit Saved to Firestore:', result.id);
      return result as Habit;
    } catch (error) {
      console.error('Add Habit Error:', error);
      return rejectWithValue('Failed to add habit');
    } finally {
      dispatch(setLoaderVisible(false));
    }
  }
);

// Async Thunk for updating a habit
export const updateHabitAsync = createAsyncThunk(
  'root/updateHabit',
  async (habit: Habit, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoaderVisible(true));
      
      const state = getState() as any;
      const uid = state.root.user?.uid;
      
      if (!uid) throw new Error('No user authenticated');

      const result = await updateHabitFirestore(uid, habit);
      
      console.log('✨ Habit Updated in Firestore:', habit.id);
      return result as Habit;
    } catch (error) {
      console.error('Update Habit Error:', error);
      return rejectWithValue('Failed to update habit');
    } finally {
      dispatch(setLoaderVisible(false));
    }
  }
);

// Async Thunk for deleting a habit
export const deleteHabitAsync = createAsyncThunk(
  'root/deleteHabit',
  async (habitId: string | number, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoaderVisible(true));
      
      const state = getState() as any;
      const uid = state.root.user?.uid;
      
      if (!uid) throw new Error('No user authenticated');

      await deleteHabitFirestore(uid, habitId.toString());
      
      console.log('🗑️ Habit Deleted from Firestore, ID:', habitId);
      return habitId;
    } catch (error) {
      console.error('Delete Habit Error:', error);
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
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
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
      .addCase(deleteHabitAsync.fulfilled, (state, action: PayloadAction<string | number>) => {
        state.habits = state.habits.filter(h => h.id !== action.payload);
        state.toastMessage = 'Habit deleted successfully! 🗑️';
      });
  },
});

export const { setLoaderVisible, setHabits, setToast, toggleDarkMode, setDarkMode, updateHabit, setUser, logout } = rootSlice.actions;
export default rootSlice.reducer;
