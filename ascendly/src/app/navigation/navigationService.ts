import { createNavigationContainerRef } from '@react-navigation/native';
import { MainStack } from './navigationTypes';

export const navigationRef = createNavigationContainerRef<MainStack>();

export function navigate(name: any, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
