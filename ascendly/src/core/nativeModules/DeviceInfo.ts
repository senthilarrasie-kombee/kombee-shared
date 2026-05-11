import {Platform} from 'react-native';
import NativeDeviceInfo from './NativeAscendlyDeviceInfo';

const DeviceInfoModule = NativeDeviceInfo;

export interface DeviceInfo {
  model: string;
  device: string;
  brand: string;
  product: string;
  manufacturer: string;
  sdk: number;
}

/**
 * Gets device information using a custom Android Native Module.
 * Returns null if on iOS or if an error occurs.
 */
export const getDeviceInfo = async (): Promise<DeviceInfo | null> => {
  if (Platform.OS !== 'android' || !DeviceInfoModule) {
    return null;
  }

  try {
    const info: DeviceInfo = await DeviceInfoModule.getDeviceInfo();
    return info;
  } catch (error) {
    console.error('Failed to get device info:', error);
    return null;
  }
};
