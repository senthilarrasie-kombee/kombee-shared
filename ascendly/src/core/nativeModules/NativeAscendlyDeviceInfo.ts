import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  getDeviceInfo(): Promise<{
    model: string;
    device: string;
    brand: string;
    product: string;
    manufacturer: string;
    sdk: number;
  }>;
}

export default TurboModuleRegistry.get<Spec>('AscendlyDeviceInfo');
