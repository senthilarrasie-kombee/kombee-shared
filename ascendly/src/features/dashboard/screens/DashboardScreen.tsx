import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import { createStyles } from './DashboardStyles';
import { DashboardType } from '@features/dashboard/types';
import { useTheme } from '@shared/theme';

import { AppButton, AppHeader } from '@shared/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ConfirmModal from '@shared/components/ConfirmModal';
import { STRINGS } from '@shared/constants/strings';

const Dashboard: React.FC<DashboardType> = ({ children }) => {
    const [count, setCount] = useState(0);
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const navigation = useNavigation<any>();
    const [isExitModalVisible, setIsExitModalVisible] = useState(false);
    const [pendingAction, setPendingAction] = useState<any>(null);

    React.useEffect(() => {
      const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Save the action to trigger it later if confirmed
        setPendingAction(e.data.action);
        setIsExitModalVisible(true);
      });

      return unsubscribe;
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
