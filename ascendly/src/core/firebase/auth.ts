import auth, { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signInWithCredential, GoogleAuthProvider, signOut as firebaseSignOut } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

console.log('All Config Variables:', JSON.stringify(Config, null, 2));

// Fallback to the known ID if Config fails to load during debugging
const WEB_CLIENT_ID = Config.GOOGLE_WEB_CLIENT_ID || '156955514963-rlgsnl6vcgt4v2trspad6vsst797rp90.apps.googleusercontent.com';

console.log('Configuring Google Sign-In with Web Client ID:', WEB_CLIENT_ID);

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});



import { syncUserProfile } from './firestore';
import { generateNumericId } from '@shared/utils/uidGenerator';

const firebaseAuth = getAuth();

export const signInWithGoogle = async (loginType: 'user' | 'admin' = 'user') => {
  try {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
    // Get the users ID token
    const signInResult = await GoogleSignin.signIn();
    
    console.log('Google Sign-In Response:', JSON.stringify(signInResult, null, 2));

    let idToken = signInResult.data?.idToken;
    if (!idToken) {
      throw new Error('No ID token found');
    }

    // Create a Google credential with the token
    const credential = GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const userCredential = await signInWithCredential(firebaseAuth, credential);
    
    // Extract provider-specific UID
    const providerUid = userCredential.user.providerData[0]?.uid || userCredential.user.uid;

    // Override the UID in the user object for internal consistency
    const userWithOverriddenUid = {
      ...userCredential.user.toJSON(),
      uid: providerUid,
      displayName: userCredential.user.displayName,
      email: userCredential.user.email,
      photoURL: userCredential.user.photoURL,
      provider: 'google',
    };

    // Sync to Firestore using the provider-specific UID
    const syncedProfile = await syncUserProfile(providerUid, userCredential.user, 'google', loginType);
    
    console.log('Firebase Auth User Credential (Original):', JSON.stringify(userCredential, null, 2));
    
    return { ...userCredential, user: syncedProfile || userWithOverriddenUid };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    await firebaseSignOut(firebaseAuth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Sign-Out Error:', error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, displayName: string, loginType: 'user' | 'admin' = 'user') => {
  try {
    const cleanEmail = email.trim();
    console.log(`Attempting Sign-Up with email: "${cleanEmail}"`);
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, cleanEmail, password);
    
    // Update profile with display name
    await updateProfile(userCredential.user, {
      displayName: displayName,
    });
    
    // For email login, generate a persistent 21-digit numeric ID matching Google's format
    const providerUid = generateNumericId(userCredential.user.uid);

    // Sync to Firestore using the generated numeric UID
    const syncedProfile = await syncUserProfile(providerUid, userCredential.user, 'email', loginType);
    
    const userWithOverriddenUid = {
      ...userCredential.user.toJSON(),
      uid: providerUid,
      displayName: displayName,
      email: userCredential.user.email,
      photoURL: userCredential.user.photoURL,
      provider: 'email',
    };
    
    console.log('Firebase Email Sign-Up Success:', JSON.stringify(userCredential, null, 2));
    return { ...userCredential, user: syncedProfile || userWithOverriddenUid };
  } catch (error) {
    console.error('Email Sign-Up Error:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string, loginType: 'user' | 'admin' = 'user') => {
  try {
    const cleanEmail = email.trim();
    console.log(`Attempting Sign-In with email: "${cleanEmail}"`);
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, cleanEmail, password);
    
    // For email login, generate a persistent 21-digit numeric ID matching Google's format
    const providerUid = generateNumericId(userCredential.user.uid);

    // Sync to Firestore using the generated numeric UID
    const syncedProfile = await syncUserProfile(providerUid, userCredential.user, 'email', loginType);
    
    const userWithOverriddenUid = {
      ...userCredential.user.toJSON(),
      uid: providerUid,
      displayName: userCredential.user.displayName,
      email: userCredential.user.email,
      photoURL: userCredential.user.photoURL,
      provider: 'email',
    };
    
    console.log('Firebase Email Sign-In Success:', JSON.stringify(userCredential, null, 2));
    return { ...userCredential, user: syncedProfile || userWithOverriddenUid };
  } catch (error) {
    console.error('Email Sign-In Error:', error);
    throw error;
  }
};
