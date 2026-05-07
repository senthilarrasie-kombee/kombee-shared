import inAppMessaging from '@react-native-firebase/in-app-messaging';

export const setInAppMessagesEnabled = async (enabled: boolean) => {
  try {
    await inAppMessaging().setMessagesDisplaySuppressed(!enabled);
    console.log(`[FIAM] In-App Messages display ${enabled ? 'enabled' : 'suppressed'}`);
  } catch (error) {
    console.error('[FIAM] setInAppMessagesEnabled error:', error);
  }
};

/**
 * Note: The React Native Firebase In-App Messaging API does not currently support 
 * JS-level listeners for message clicks or dismissals. These events are 
 * automatically logged to Firebase Analytics natively.
 */
export const setupInAppMessagingListeners = () => {
  // No-op for now as JS listeners are not supported in the current version
  return () => {};
};

export const triggerInAppEvent = async (eventId: string) => {
  try {
    // Events triggered via Analytics can be used as FIAM triggers
    console.log('[FIAM] Event logged (use this as a trigger in Firebase Console):', eventId);
  } catch (error) {
    console.error('[FIAM] triggerInAppEvent error:', error);
  }
};
