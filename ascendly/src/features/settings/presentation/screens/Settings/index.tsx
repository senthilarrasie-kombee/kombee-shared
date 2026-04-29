import React from 'react';
import { View, StyleSheet, Switch, Appearance, useColorScheme } from 'react-native';
import { AppText } from '@/components';
import { useTheme, Spacing } from '@/core/theme';

const SettingsScreen = () => {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const toggleTheme = (value: boolean) => {
    Appearance.setColorScheme(value ? 'dark' : 'light');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <AppText style={styles.label}>Dark Mode</AppText>
        <Switch 
          value={isDark} 
          onValueChange={toggleTheme} 
          trackColor={{ false: '#767577', true: colors.primary }}
          thumbColor={isDark ? '#fff' : '#f4f3f4'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: Spacing.s4 
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.s3,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 18,
  }
});

export default SettingsScreen;
