import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay, 
  withSequence, 
  withTiming 
} from 'react-native-reanimated';
import { useAppSelector, useAppDispatch } from '@store';
import { useTheme, FontFamily, FontSize } from '@shared/theme';
import { setToast } from '@store/reducers/rootSlice';
import AppText from './AppText';

const { width } = Dimensions.get('window');

const AppToast = () => {
  const message = useAppSelector((state) => state.root.toastMessage);
  const dispatch = useAppDispatch();
  const { colors, isDark } = useTheme();
  
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (message) {
      // Animation sequence: slide in, wait, slide out
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, { duration: 400 });

      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        translateY.value = withTiming(100, { duration: 300 }, () => {
          // Clear message in Redux after animation
          // We must do this on the JS thread
        });
        
        // Use a second timer to clear the state so the next message can trigger
        setTimeout(() => {
          dispatch(setToast(null));
        }, 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, dispatch, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!message) return null;

  return (
    <View style={styles.outerContainer} pointerEvents="none">
      <Animated.View style={[
        styles.toastBox, 
        { backgroundColor: isDark ? '#2D2D3A' : '#1E293B' },
        animatedStyle
      ]}>
        <AppText style={styles.toastText}>{message}</AppText>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastBox: {
    width: width * 0.85,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    textAlign: 'center',
  },
});

export default AppToast;
