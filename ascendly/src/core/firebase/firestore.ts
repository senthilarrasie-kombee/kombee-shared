import {getApp} from '@react-native-firebase/app';
import firestore, {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  FieldValue,
} from '@react-native-firebase/firestore';

import {getMessaging, getToken} from '@react-native-firebase/messaging';
import {Appearance} from 'react-native';
import {FIRESTORE_DB_NAME, COLLECTIONS} from '@shared/constants/firebase';
import {getDeviceInfo} from '../nativeModules/DeviceInfo';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  photoURL: string | null;
  location?: string | null;
  country?: string | null;
  mobileNumber?: string | null;
  countryCode?: string | null;
  fcmToken?: string | null;
  theme?: string;
  isPremium?: boolean;
  deviceDetails?: {
    model: string;
    device: string;
    brand: string;
    product: string;
    manufacturer: string;
    sdk: number;
  };
  createdAt?: any;
  updatedAt?: any;
  lastReflectionAt?: any;
  totalReflections?: number;
  provider: string;
  loginType?: 'user' | 'admin';
}

// Initialize Firestore database
const db = getFirestore(getApp(), FIRESTORE_DB_NAME);
const usersCollection = collection(db, COLLECTIONS.USERS);

/**
 * Sync user profile data
 */
export const syncUserProfile = async (
  uid: string,
  user: any,
  provider: string,
  loginType: 'user' | 'admin' = 'user'
) => {
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, uid);
    const userSnapshot = await getDoc(userDocRef);

    // Fetch Device Info from Native Module
    const deviceInfo = await getDeviceInfo();

    // Fetch FCM token
    let fcmToken = null;
    try {
      fcmToken = await getToken(getMessaging());
    } catch (e) {
      console.warn('FCM collection failed:', e);
    }

    // Process user name
    const names = (user.displayName || '').split(' ');
    const firstName = names[0] || null;
    const lastName = names.slice(1).join(' ') || null;

    const existingData = userSnapshot.exists() ? (userSnapshot.data() as UserProfile) : null;

    const userData: UserProfile = {
      uid: uid,
      email: user.email,
      displayName: user.displayName || `${firstName} ${lastName || ''}`.trim(),
      firstName: firstName,
      lastName: lastName,
      photoURL: user.photoURL,
      location: null,
      country: null,
      mobileNumber: user.phoneNumber || null,
      countryCode: null,
      fcmToken: fcmToken,
      theme: Appearance.getColorScheme() || 'light',
      isPremium: false,
      deviceDetails: deviceInfo
        ? {
            model: deviceInfo.model,
            device: deviceInfo.device,
            brand: deviceInfo.brand,
            product: deviceInfo.product,
            manufacturer: deviceInfo.manufacturer,
            sdk: deviceInfo.sdk,
          }
        : undefined,
      updatedAt: serverTimestamp(),
      provider: provider,
      loginType: existingData?.loginType || loginType,
      createdAt: existingData ? existingData.createdAt : serverTimestamp(),
    };

    console.log('Firestore: Syncing user profile with data:', JSON.stringify(userData, null, 2));

    await setDoc(userDocRef, userData, {merge: true});
    console.log(`Firestore: Synced ${uid}`);
    return userData;
  } catch (error: any) {
    console.error('Firestore Sync Error:', error);
    return null;
  }
};

/**
 * Specifically sync only device and FCM details to Firestore
 */
export const syncDeviceDetails = async (uid: string) => {
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, uid);
    
    // Fetch Device Info
    const deviceInfo = await getDeviceInfo();
    
    // Fetch FCM token
    let fcmToken = null;
    try {
      fcmToken = await getToken(getMessaging());
    } catch (e) {
      console.warn('FCM collection failed in syncDeviceDetails:', e);
    }

    const deviceUpdate = {
      fcmToken: fcmToken,
      deviceDetails: deviceInfo ? {
        model: deviceInfo.model,
        device: deviceInfo.device,
        brand: deviceInfo.brand,
        product: deviceInfo.product,
        manufacturer: deviceInfo.manufacturer,
        sdk: deviceInfo.sdk,
      } : undefined,
      updatedAt: serverTimestamp(),
    };

    console.log('Firestore: Updating device details with:', JSON.stringify(deviceUpdate, null, 2));

    await setDoc(userDocRef, deviceUpdate, {merge: true});
    console.log(`Firestore: Updated device details for ${uid}`);
    return true;
  } catch (error) {
    console.error('Firestore Device Sync Error:', error);
    return false;
  }
};

/**
 * Helper to convert ISO strings to Dates for Firestore
 */
const formatForFirestore = (data: any) => {
  const result = {...data};
  const dateFields = ['createdDate', 'startDate', 'endDate', 'lastSyncedAt'];

  dateFields.forEach(field => {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = new Date(result[field]);
    }
  });

  // Handle nested completions dates
  if (result.completions && Array.isArray(result.completions)) {
    result.completions = result.completions.map((c: any) => ({
      ...c,
      date: c.date ? new Date(c.date) : new Date(),
    }));
  }

  return result;
};

/**
 * Helper to convert Timestamps from Firestore to ISO strings
 */
const parseFromFirestore = (data: any) => {
  if (!data) return data;
  const result = {...data};
  const dateFields = ['createdDate', 'startDate', 'endDate', 'lastSyncedAt', 'updatedAt', 'createdAt', 'lastReflectionAt'];

  dateFields.forEach(field => {
    if (result[field] && typeof result[field].toDate === 'function') {
      result[field] = result[field].toDate().toISOString();
    }
  });

  // Handle nested completions dates
  if (result.completions && Array.isArray(result.completions)) {
    result.completions = result.completions.map((c: any) => ({
      ...c,
      date: (c.date && typeof c.date.toDate === 'function') 
        ? c.date.toDate().toISOString().split('T')[0] 
        : c.date,
    }));
  }

  return result;
};

/**
 * Fetch a single user profile
 */
export const getUserProfile = async (uid: string) => {
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, uid);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      return parseFromFirestore(userSnapshot.data()) as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Firestore Fetch Profile Error:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, uid);
    await setDoc(userDocRef, {...data, updatedAt: serverTimestamp()}, {merge: true});
    return true;
  } catch (error) {
    console.error('Firestore Update Profile Error:', error);
    throw error;
  }
};

/**
 * Bulk upload habits
 */
export const bulkUploadHabits = async (uid: string, habits: any[]) => {
  try {
    console.log(`Firestore: Uploading ${habits.length} habits`);
    const habitsSubCollection = collection(db, COLLECTIONS.HABITS, uid, COLLECTIONS.HABITS);

    for (const habit of habits) {
      const {id, ...habitData} = habit;
      await addDoc(habitsSubCollection, {
        ...formatForFirestore(habitData),
        updatedAt: serverTimestamp(),
      });
    }

    console.log(`Firestore: Uploaded ${habits.length} habits`);
    return true;
  } catch (error) {
    console.error('Firestore Upload Error:', error);
    throw error;
  }
};

/**
 * Delete user habits
 */
export const deleteUserHabits = async (uid: string) => {
  try {
    console.log(`Firestore: Deleting habits`);
    const habitsSubCollection = collection(db, COLLECTIONS.HABITS, uid, COLLECTIONS.HABITS);
    const habitsSnapshot = await getDocs(habitsSubCollection);

    const deletePromises = habitsSnapshot.docs.map(habitDoc => deleteDoc(habitDoc.ref));

    await Promise.all(deletePromises);
    console.log(`Firestore: Deleted ${habitsSnapshot.size} habits`);
    return true;
  } catch (error) {
    console.error('Firestore Delete Error:', error);
    throw error;
  }
};

/**
 * Fetch user habits
 */
export const getUserHabits = async (uid: string) => {
  try {
    console.log(`Firestore: Fetching habits`);
    const habitsSubCollection = collection(db, COLLECTIONS.HABITS, uid, COLLECTIONS.HABITS);
    const habitsSnapshot = await getDocs(habitsSubCollection);

    const habits = habitsSnapshot.docs.map(doc => ({
      ...parseFromFirestore(doc.data()),
      id: doc.id,
    }));

    console.log(`Firestore: Found ${habits.length} habits`);
    return habits;
  } catch (error) {
    console.error('Firestore Fetch Error:', error);
    throw error;
  }
};

/**
 * Add a new habit
 */
export const addHabit = async (uid: string, habit: any) => {
  try {
    console.log(`Firestore: Adding habit`);
    const habitsSubCollection = collection(db, COLLECTIONS.HABITS, uid, COLLECTIONS.HABITS);

    const docRef = await addDoc(habitsSubCollection, {
      ...formatForFirestore(habit),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`Firestore: Added with ID ${docRef.id}`);
    return {...habit, id: docRef.id};
  } catch (error) {
    console.error('Firestore Add Error:', error);
    throw error;
  }
};

/**
 * Update a habit
 */
export const updateHabit = async (uid: string, habit: any) => {
  try {
    const habitRef = doc(db, COLLECTIONS.HABITS, uid, COLLECTIONS.HABITS, habit.id);
    const {id, ...updateData} = habit;

    await setDoc(
      habitRef,
      {
        ...formatForFirestore(updateData),
        updatedAt: serverTimestamp(),
      },
      {merge: true}
    );

    return habit;
  } catch (error) {
    console.error('Firestore Update Error:', error);
    throw error;
  }
};

/**
 * Delete a single habit
 */
export const deleteHabit = async (uid: string, habitId: string) => {
  try {
    const habitRef = doc(db, COLLECTIONS.HABITS, uid, COLLECTIONS.HABITS, habitId);
    await deleteDoc(habitRef);
    return habitId;
  } catch (error) {
    console.error('Firestore Delete Error:', error);
    throw error;
  }
};
