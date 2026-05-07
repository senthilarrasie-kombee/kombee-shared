import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import { createStyles } from './DashboardStyles';
import { DashboardType } from '@shared/types/dashboard';
import { useTheme } from '@shared/theme';

import { AppButton, AppHeader } from '@shared/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ConfirmModal from '@shared/components/ConfirmModal';
import { STRINGS } from '@shared/constants/strings';
import { storage, logAllStorageData, asyncStorage, ASYNC_STORAGE_KEYS } from '@core/storage';
import { STORAGE_KEYS } from '@core/storage/keys';
import { LOCAL_APP_VERSION, ONLINE_APP_VERSION } from '@core/config/appVersion';

const Dashboard: React.FC<DashboardType> = ({ children }) => {
    const [count, setCount] = useState(0);
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const navigation = useNavigation<any>();
    const [isExitModalVisible, setIsExitModalVisible] = useState(false);
    const [pendingAction, setPendingAction] = useState<any>(null);

    useEffect(() => {
      // Log versions
      console.log(`[Version] Local: ${LOCAL_APP_VERSION}, Online: ${ONLINE_APP_VERSION}`);
      
      // Store last login
      storage.set(STORAGE_KEYS.APP.LAST_LOGIN, new Date().toISOString());
      
      // Update Rating Prompt Count
      const updateRatingPromptCount = async () => {
        const currentCount = await asyncStorage.getObject<number>(ASYNC_STORAGE_KEYS.RATING_PROMPT_COUNT) || 0;
        await asyncStorage.setObject(ASYNC_STORAGE_KEYS.RATING_PROMPT_COUNT, currentCount + 1);
        console.log(`[Dashboard] Visit count for rating: ${currentCount + 1}`);
      };
      
      updateRatingPromptCount();
      logAllStorageData();
      asyncStorage.logAllData();
    }, []);

    useEffect(() => {
      const backAction = () => {
        setIsExitModalVisible(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Save the action to trigger it later if confirmed
        setPendingAction(e.data.action);
        setIsExitModalVisible(true);
      });

      return () => {
        backHandler.remove();
        unsubscribe();
      };
    }, [navigation]);

    const confirmExit = () => {
      setIsExitModalVisible(false);
      // Exit the app entirely
      BackHandler.exitApp();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <AppHeader title="Dashboard" showMenu={true} />
            <View style={styles.content}>
                <Text style={styles.counterText}>{count}</Text>
                <AppButton 
                    title="Increment"
                    onPress={() => setCount(count + 1)}
                    style={{ paddingHorizontal: 30 }}
                />
            </View>

            <ConfirmModal
              isVisible={isExitModalVisible}
              title={STRINGS.EXIT_APP.TITLE}
              message={STRINGS.EXIT_APP.MESSAGE}
              confirmText={STRINGS.EXIT_APP.CONFIRM}
              onConfirm={confirmExit}
              onCancel={() => setIsExitModalVisible(false)}
              type="info"
            />
        </SafeAreaView>
    );
};

export default Dashboard;
