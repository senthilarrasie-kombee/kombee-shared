declare module 'react-native-config' {
  export interface NativeConfig {
    APP_ENV?: string;
    API_URL?: string;
    APP_NAME?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
