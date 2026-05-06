import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';
import { useAppSelector } from '@store';
import { useTheme, FontFamily, FontSize } from '@shared/theme';
import AppText from './AppText';

const AppLoader = () => {
  const isVisible = useAppSelector((state) => state.root.isLoaderVisible);
  const { colors, isDark } = useTheme();
  
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isVisible) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      scale.value = 1;
    }
  }, [isVisible, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!isVisible) return null;

  return (
    <Modal transparent animationType="fade" visible={isVisible}>
      <View style={styles.container}>
        <Animated.View style={[
          styles.loaderBox, 
          { backgroundColor: isDark ? '#1E1E26' : '#FFFFFF' },
          animatedStyle
        ]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <AppText style={styles.loadingText}>
            Please wait...
          </AppText>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    minWidth: 150,
  },
  loadingText: {
    marginTop: 16,
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default AppLoader;
