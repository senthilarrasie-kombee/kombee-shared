import React from 'react';
import { 
  TextInput, 
  StyleSheet, 
  View, 
  TextInputProps, 
  ViewStyle, 
  Platform 
} from 'react-native';
import { useTheme, FontFamily, Spacing } from '@/core/theme';

interface AppTextInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
}

const AppTextInput: React.FC<AppTextInputProps> = ({ 
  containerStyle, 
  inputStyle, 
  ...props 
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: 20,
    },
    input: {
      backgroundColor: colors.background === '#FFFFFF' ? '#F3F4F6' : '#1C1C27',
      borderRadius: 16,
      paddingHorizontal: 20,
      paddingVertical: Platform.OS === 'ios' ? Spacing.s3 : Spacing.s1,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
      fontFamily: FontFamily.regular,
      fontSize: 16,
      textAlignVertical: 'center',
      includeFontPadding: false,
      height: 48,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
    </View>
  );
};

export default AppTextInput;
