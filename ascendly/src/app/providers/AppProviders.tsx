import React, {PropsWithChildren} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Provider} from 'react-redux';
import {store} from '@store';
import AppLoader from '@shared/components/AppLoader';
import AppToast from '@shared/components/AppToast';

import {useInitialHydration} from '../../shared/hooks/useInitialHydration';

const Initializer: React.FC = () => {
  useInitialHydration();
  return null;
};

const AppProviders: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <Provider store={store}>
      <Initializer />
      <SafeAreaProvider>
        {children}
        <AppLoader />
        <AppToast />
      </SafeAreaProvider>
    </Provider>
  );
};

export default AppProviders;
