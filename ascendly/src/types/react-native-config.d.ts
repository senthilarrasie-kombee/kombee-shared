declare module 'react-native-config' {
  export interface NativeConfig {
    ENABLE_LOGGING?: string;
    ENV?: string;
    GOOGLE_WEB_CLIENT_ID?: string;
    API_URL?: string;
  }
  
  const Config: NativeConfig;
  export default Config;
}
