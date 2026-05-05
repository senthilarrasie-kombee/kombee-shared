import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createStyles } from './DashboardStyles';
import { DashboardType } from '@features/dashboard/types';
import { useTheme } from '@shared/theme';

import { AppButton, AppHeader } from '@shared/components';
import { SafeAreaView } from 'react-native-safe-area-context';

const Dashboard: React.FC<DashboardType> = ({ children }) => {
    const [count, setCount] = useState(0);
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

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
        </SafeAreaView>
    );
};

export default Dashboard;
