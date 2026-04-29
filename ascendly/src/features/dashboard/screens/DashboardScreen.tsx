import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createStyles } from './DashboardStyles';
import { DashboardType } from '@features/dashboard/types';
import { useTheme } from '@shared/theme';

import { AppButton } from '@shared/components';

const Dashboard: React.FC<DashboardType> = ({ children }) => {
    const [count, setCount] = useState(0);
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.counterText}>{count}</Text>
            <AppButton 
                title="Increment"
                onPress={() => setCount(count + 1)}
                style={{ paddingHorizontal: 30 }}
            />
        </View>
    );
};

export default Dashboard;
