import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@shared/components';
import { useTheme } from '@shared/theme';

const ProfileScreen = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppText>Profile Screen</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ProfileScreen;
