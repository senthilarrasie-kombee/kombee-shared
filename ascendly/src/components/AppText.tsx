import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme, FontFamily, FontSize } from '@/core/theme';

interface AppTextProps extends TextProps {
  children: React.ReactNode;
}

const AppText: React.FC<AppTextProps> = ({ style, children, ...props }) => {
  const { colors } = useTheme();

  return (
    <Text 
      style={[
        { 
          color: colors.textPrimary, 
          fontFamily: FontFamily.regular, 
          fontSize: FontSize.md 
        }, 
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};

export default AppText;
