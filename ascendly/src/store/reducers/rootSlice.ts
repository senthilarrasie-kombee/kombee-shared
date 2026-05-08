import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {Habit} from '@shared/types/habit';

import {
  UserProfile,
  getUserHabits,
  addHabit,
  updateHabit as updateHabitFirestore,
  deleteHabit as deleteHabitFirestore,
  getUserProfile,
} from '@core/firebase/firestore';
import {storage, secureStorage} from '@core/storage';
import {STORAGE_KEYS} from '@core/storage/keys';

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

// Async Thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'root/fetchUserProfile',
  async (forceRefresh: boolean | void = false, {dispatch, getState, rejectWithValue}) => {
    try {
      const state = getState() as any;
      // Skip if user already exists and no force refresh requested
      if (!forceRefresh && state.root.user) {
        return state.root.user;
      }

      const uid = await secureStorage.getItem(STORAGE_KEYS.AUTH.USER_ID);
      if (!uid) {
        console.warn('Fetch Profile: No UID found in Secure Storage');
        return null;
      }

      const profile = await getUserProfile(uid);
      if (profile) {
        console.log(`Fetched profile for ${uid}`);
        return profile;
      }
      return null;
    } catch (error) {
      console.error('Fetch Profile Error:', error);
      return rejectWithValue('Failed to fetch profile');
    }
  }
);

// Async Thunk for fetching habits
export const fetchHabits = createAsyncThunk(
  'root/fetchHabits',
  async (isRefresh: boolean | void = false, {dispatch, getState, rejectWithValue}) => {
    try {
      const state = getState() as any;
      // Skip if habits already exist and no refresh requested
      if (!isRefresh && state.root.habits.length > 0) {
        return state.root.habits;
      }

      const uid = await secureStorage.getItem(STORAGE_KEYS.AUTH.USER_ID);
      if (!uid) {
        console.warn('Fetch Habits: No UID found in Secure Storage');
        return [];
      }

      const habits = await getUserHabits(uid);

      console.log(`Fetched ${habits.length} habits from Firestore`);
      return habits as unknown as Habit[];
    } catch (error) {
      console.error('Fetch Habits Error:', error);
      return rejectWithValue('Failed to fetch habits');
    }
  }
);

// Async Thunk for adding a habit
export const addHabitAsync = createAsyncThunk(
  'root/addHabit',
  async (habit: Omit<Habit, 'id' | 'createdDate'>, {dispatch, getState, rejectWithValue}) => {
    try {
      dispatch(setLoaderVisible(true));

      const uid = await secureStorage.getItem(STORAGE_KEYS.AUTH.USER_ID);

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
  async (habit: Habit, {dispatch, getState, rejectWithValue}) => {
    try {
      dispatch(setLoaderVisible(true));

      const uid = await secureStorage.getItem(STORAGE_KEYS.AUTH.USER_ID);

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
  async (habitId: string | number, {dispatch, getState, rejectWithValue}) => {
    try {
      dispatch(setLoaderVisible(true));

      const uid = await secureStorage.getItem(STORAGE_KEYS.AUTH.USER_ID);

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
    toggleDarkMode: state => {
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
    logout: state => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchHabits.pending, state => {
        state.loading = true;
        state.isLoaderVisible = true;
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action: PayloadAction<Habit[]>) => {
        state.loading = false;
        state.isLoaderVisible = false;
        state.habits = action.payload;
        state.toastMessage = 'Habits updated successfully! ✅';
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false;
        state.isLoaderVisible = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserProfile.pending, state => {
        state.loading = true;
        state.isLoaderVisible = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile | null>) => {
        state.loading = false;
        state.isLoaderVisible = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.isLoaderVisible = false;
        state.error = action.payload as string;
        state.toastMessage = action.payload as string; // Trigger toast
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

export const {setLoaderVisible, setHabits, setToast, toggleDarkMode, setDarkMode, updateHabit, setUser, logout} =
  rootSlice.actions;
export default rootSlice.reducer;
