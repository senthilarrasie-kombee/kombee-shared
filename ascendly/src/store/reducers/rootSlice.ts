import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {Habit} from '@shared/types/habit';

import {
  UserProfile,
  getUserHabits,
  addHabit,
  updateHabit as updateHabitFirestore,
  deleteHabit as deleteHabitFirestore,
  getUserProfile,
  syncDeviceDetails,
  updateUserProfile,
  syncUserProfile,
} from '@core/firebase/firestore';
import {habitRepo} from '@core/storage/sqlite/repositories/HabitRepository';
import {completionRepo} from '@core/storage/sqlite/repositories/CompletionRepository';
import {syncQueueRepo} from '@core/storage/sqlite/repositories/SyncQueueRepository';
import {syncService} from '@core/storage/sqlite/SyncService';
import {runMigrations} from '@core/storage/sqlite/schema';
import {storage, secureStorage} from '@core/storage';
import {STORAGE_KEYS} from '@core/storage/keys';
import {signInWithGoogle, signInWithEmail, signUpWithEmail} from '@core';
import auth from '@react-native-firebase/auth';
import {AuthService} from '@core/auth/AuthService';
import {STRINGS} from '@shared/constants/strings';

interface RootState {
  isLoaderVisible: boolean;
  habits: Habit[];
  loading: boolean;
  error: string | null;
  toast: {
    message: string | null;
    type: 'success' | 'error' | 'info';
  };
  isDarkMode: boolean;
  user: UserProfile | null;
  isAuthenticated: boolean;
}

const initialState: RootState = {
  isLoaderVisible: false,
  habits: [],
  loading: false,
  error: null,
  toast: {
    message: null,
    type: 'info',
  },
  isDarkMode: false,
  user: null,
  isAuthenticated: false,
};

// Async Thunk for Hydrating Store from SQLite
export const hydrateStore = createAsyncThunk(
  'root/hydrateStore',
  async (_, {dispatch, rejectWithValue}) => {
    try {
      // 1. Ensure DB schema is up to date
      await runMigrations();

      const uid = await secureStorage.getItem(STORAGE_KEYS.AUTH.USER_ID);
      if (!uid) return;

      // 2. Fetch habits from SQLite
      const habits = await habitRepo.findByUserId(uid);
      
      if (habits.length > 0) {
        dispatch(setHabits(habits));
      }

      // 3. Trigger background sync
      dispatch(fetchHabits(true));
      syncService.processQueue(uid);

      return true;
    } catch (error) {
      console.error('Hydration Error:', error);
      return rejectWithValue('Failed to hydrate store');
    }
  }
);

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
        // Update device details in background
        syncDeviceDetails(uid).catch(e => console.error('Background device sync failed:', e));
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

      // Save to SQLite
      for (const habit of habits) {
        await habitRepo.save(uid, habit as Habit);
      }

      console.log(`Fetched ${habits.length} habits from Firestore and cached to SQLite`);
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

      const habitWithDate = {
        ...habit,
        createdDate: new Date().toISOString(),
        id: `local_${Date.now()}`, // Temporary local ID
      } as Habit;

      // 1. Save to SQLite immediately
      await habitRepo.save(uid, {...habitWithDate, isDirty: true});
      
      // 2. Add to Sync Queue
      await syncQueueRepo.enqueue({
        entityType: 'habit',
        entityId: habitWithDate.id.toString(),
        operation: 'create',
        payload: JSON.stringify(habitWithDate),
      });

      // 3. Attempt Firestore Sync in background
      addHabit(uid, habitWithDate).then(async (result) => {
        await habitRepo.save(uid, {...result, isDirty: false, lastSyncedAt: new Date().toISOString()});
        // Remove from queue or mark as synced (SyncService handles this if we call it)
        syncService.processQueue(uid);
      }).catch(err => {
        console.warn('Initial Firestore sync failed, will retry via queue:', err);
      });

      return habitWithDate;
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

      const updatedHabit = {...habit, updatedAt: new Date().toISOString()};

      // 1. Update SQLite immediately
      console.log('💾 SQLite: Saving habit update offline...', updatedHabit.id);
      await habitRepo.save(uid, {...updatedHabit, isDirty: true});

      // 2. Add to Sync Queue
      console.log('💾 SQLite: Enqueuing sync operation for', updatedHabit.id);
      await syncQueueRepo.enqueue({
        entityType: 'habit',
        entityId: updatedHabit.id.toString(),
        operation: 'update',
        payload: JSON.stringify(updatedHabit),
      });

      // 3. Attempt Firestore Sync
      updateHabitFirestore(uid, updatedHabit).then(async (result) => {
        await habitRepo.save(uid, {...result, isDirty: false, lastSyncedAt: new Date().toISOString()});
        syncService.processQueue(uid);
      }).catch(err => {
        console.warn('Firestore update failed, will retry via queue:', err);
      });

      return updatedHabit;
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

      // 1. Soft delete in SQLite
      await habitRepo.softDelete(habitId);

      // 2. Add to Sync Queue
      await syncQueueRepo.enqueue({
        entityType: 'habit',
        entityId: habitId.toString(),
        operation: 'delete',
        payload: JSON.stringify({id: habitId}),
      });

      // 3. Attempt Firestore Delete
      deleteHabitFirestore(uid, habitId.toString()).then(() => {
        // Hard delete from SQLite if sync successful
        habitRepo.delete(habitId);
        syncService.processQueue(uid);
      }).catch(err => {
        console.warn('Firestore delete failed, will retry via queue:', err);
      });

      return habitId;
    } catch (error) {
      console.error('Delete Habit Error:', error);
      return rejectWithValue('Failed to delete habit');
    } finally {
      dispatch(setLoaderVisible(false));
    }
  }
);

// Async Thunk for updating user profile
export const updateUserProfileAsync = createAsyncThunk(
  'root/updateUserProfile',
  async (data: Partial<UserProfile>, {dispatch, getState, rejectWithValue}) => {
    try {
      const uid = await secureStorage.getItem(STORAGE_KEYS.AUTH.USER_ID);
      if (!uid) throw new Error('No user authenticated');

      await updateUserProfile(uid, data);
      return data;
    } catch (error) {
      console.error('Update Profile Error:', error);
      return rejectWithValue('Failed to update profile');
    }
  }
);

// Async Thunk for Sign In with Email
export const signInWithEmailAction = createAsyncThunk(
  'root/signInWithEmail',
  async ({email, password}: any, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoaderVisible(true));
      const userCredential = await signInWithEmail(email, password);

      if (userCredential) {
        // Persist session
        await secureStorage.setItem(STORAGE_KEYS.AUTH.USER_ID, userCredential.user.uid);
        storage.set(STORAGE_KEYS.AUTH.IS_LOGGED_IN, true);
        if (userCredential.user.displayName) {
          storage.set(STORAGE_KEYS.AUTH.DISPLAY_NAME, userCredential.user.displayName);
        }

        // Simulate Token Flow
        const idToken = await auth().currentUser?.getIdToken();
        await AuthService.simulateLogin(idToken || undefined);

        const profile = await syncUserProfile(
          userCredential.user.uid,
          userCredential.user,
          'email'
        );
        return profile;
      }
      return null;
    } catch (error: any) {
      let errorMessage = STRINGS.AUTH.ERRORS.INVALID_CREDENTIALS;
      if (error.code === 'auth/invalid-credential') {
        errorMessage = STRINGS.AUTH.ERRORS.INVALID_CREDENTIALS;
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Try again later.';
      }
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoaderVisible(false));
    }
  }
);

// Async Thunk for Sign In with Google
export const signInWithGoogleAction = createAsyncThunk(
  'root/signInWithGoogle',
  async (_, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoaderVisible(true));
      const userCredential = await signInWithGoogle();

      if (userCredential) {
        await secureStorage.setItem(STORAGE_KEYS.AUTH.USER_ID, userCredential.user.uid);
        storage.set(STORAGE_KEYS.AUTH.IS_LOGGED_IN, true);
        if (userCredential.user.displayName) {
          storage.set(STORAGE_KEYS.AUTH.DISPLAY_NAME, userCredential.user.displayName);
        }

        const idToken = await auth().currentUser?.getIdToken();
        await AuthService.simulateLogin(idToken || undefined);

        const profile = await syncUserProfile(
          userCredential.user.uid,
          userCredential.user,
          'google.com'
        );
        return profile;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Google Sign-In failed.');
    } finally {
      dispatch(setLoaderVisible(false));
    }
  }
);

// Async Thunk for Sign Up with Email
export const signUpWithEmailAction = createAsyncThunk(
  'root/signUpWithEmail',
  async ({email, password, name}: any, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoaderVisible(true));
      const userCredential = await signUpWithEmail(email, password, name);

      if (userCredential) {
        // Persist session
        await secureStorage.setItem(STORAGE_KEYS.AUTH.USER_ID, userCredential.user.uid);
        storage.set(STORAGE_KEYS.AUTH.IS_LOGGED_IN, true);
        if (userCredential.user.displayName) {
          storage.set(STORAGE_KEYS.AUTH.DISPLAY_NAME, userCredential.user.displayName);
        }

        // Simulate Token Flow
        const idToken = await auth().currentUser?.getIdToken();
        await AuthService.simulateLogin(idToken || undefined);

        const profile = await syncUserProfile(
          userCredential.user.uid,
          userCredential.user,
          'email'
        );
        return profile;
      }
      return null;
    } catch (error: any) {
      console.log('[Auth Thunk] Registration Error (Silenced):', error.code);
      let errorMessage = STRINGS.AUTH.ERRORS.GENERIC;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = STRINGS.AUTH.ERRORS.EMAIL_EXISTS;
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = STRINGS.AUTH.ERRORS.INVALID_EMAIL;
      } else if (error.code === 'auth/weak-password') {
        errorMessage = STRINGS.AUTH.ERRORS.WEAK_PASSWORD;
      }
      return rejectWithValue(errorMessage);
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
    setToast: (state, action: PayloadAction<string | {message: string; type: 'success' | 'error' | 'info'} | null>) => {
      if (typeof action.payload === 'string') {
        state.toast = {message: action.payload, type: 'info'};
      } else if (action.payload === null) {
        state.toast = {message: null, type: 'info'};
      } else {
        state.toast = action.payload;
      }
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
        state.toast = {message: 'Habits updated successfully! ✅', type: 'success'};
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false;
        state.isLoaderVisible = false;
        state.error = action.payload as string;
        state.toast = {message: action.payload as string, type: 'error'};
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
        state.toast = {message: action.payload as string, type: 'error'};
      })
      .addCase(addHabitAsync.fulfilled, (state, action: PayloadAction<Habit>) => {
        state.habits.push(action.payload);
        state.toast = {message: 'Habit created successfully! 🎯', type: 'success'};
      })
      .addCase(updateHabitAsync.fulfilled, (state, action: PayloadAction<Habit>) => {
        const index = state.habits.findIndex(h => h.id === action.payload.id);
        if (index !== -1) {
          state.habits[index] = action.payload;
        }
        state.toast = {message: 'Habit updated successfully! ✨', type: 'success'};
      })
      .addCase(deleteHabitAsync.fulfilled, (state, action: PayloadAction<string | number>) => {
        state.habits = state.habits.filter(h => h.id !== action.payload);
        state.toast = {message: 'Habit deleted successfully! 🗑️', type: 'info'};
      })
      .addCase(signInWithEmailAction.fulfilled, (state, action: PayloadAction<UserProfile | null>) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.toast = {message: STRINGS.AUTH.LOGIN_SUCCESS, type: 'success'};
        }
      })
      .addCase(signInWithEmailAction.rejected, (state, action) => {
        state.toast = {message: action.payload as string, type: 'error'};
      })
      .addCase(signInWithGoogleAction.fulfilled, (state, action: PayloadAction<UserProfile | null>) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.toast = {message: STRINGS.AUTH.LOGIN_SUCCESS, type: 'success'};
        }
      })
      .addCase(signInWithGoogleAction.rejected, (state, action) => {
        state.toast = {message: action.payload as string, type: 'error'};
      })
      .addCase(signUpWithEmailAction.fulfilled, (state, action: PayloadAction<UserProfile | null>) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.toast = {message: STRINGS.AUTH.REGISTER_SUCCESS, type: 'success'};
        }
      })
      .addCase(signUpWithEmailAction.rejected, (state, action) => {
        state.toast = {message: action.payload as string, type: 'error'};
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
        if (state.user) {
          state.user = {...state.user, ...action.payload};
        }
      });
  },
});

export const {setLoaderVisible, setHabits, setToast, toggleDarkMode, setDarkMode, updateHabit, setUser, logout} =
  rootSlice.actions;

export default rootSlice.reducer;
