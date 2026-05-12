export const STORAGE_KEYS = {
  AUTH: {
    USER_TOKEN: 'user_token',
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    FIREBASE_TOKEN: 'firebase_token',
    USER_ID: 'user_id',
    IS_LOGGED_IN: 'is_logged_in',
    DISPLAY_NAME: 'user_display_name',
  },
  APP: {
    IS_FIRST_LAUNCH: 'is_first_launch',
    THEME: 'app_theme',
    LAST_LOGIN: 'last_login',
    LOCAL_VERSION: 'local_version',
  },
  FCM: {
    TOKEN: 'fcm_token',
  },
  SYNC: {
    OFFLINE_QUEUE: 'offline_sync_queue',
  },
};

export const ASYNC_STORAGE_KEYS = {
  SEARCH_HISTORY: 'search_history',
  ONBOARDING_FLAGS: 'onboarding_flags',
  FORM_DRAFT_HABIT: 'form_draft_habit',
  RATING_PROMPT_COUNT: 'rating_prompt_count',
  LAST_DENIED_RATING_DATE: 'last_denied_rating_date',
  DATE_TIME_PREFERENCES: 'date_time_preferences',
  FEATURE_FLAGS_CACHE: 'feature_flags_cache',
  PENDING_ANALYTICS_EVENTS: 'pending_analytics_events',
};
