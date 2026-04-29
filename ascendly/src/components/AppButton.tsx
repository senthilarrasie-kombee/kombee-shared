import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';
import { useTheme, FontFamily } from '@/core/theme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({ 
  title, 
  onPress, 
  style, 
  textStyle,
  disabled = false 
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          backgroundColor: colors.primary,
          borderRadius: 16,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
          opacity: disabled ? 0.5 : (pressed ? 0.9 : 1),
          transform: [{ scale: !disabled && pressed ? 0.98 : 1 }],
        },
        style,
      ]}
    >
      <Text
        style={[
          {
            color: '#FFFFFF',
            fontSize: 18,
            fontFamily: FontFamily.semiBold,
            includeFontPadding: false,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default AppButton;
