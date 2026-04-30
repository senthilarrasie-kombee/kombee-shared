import React from 'react';
import { 
  TextInput, 
  StyleSheet, 
  View, 
  TextInputProps, 
  ViewStyle, 
  Platform 
} from 'react-native';
import { useTheme, FontFamily, Spacing } from '@shared/theme';

interface AppTextInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  error?: string | boolean;
  rightElement?: React.ReactNode;
}

const AppTextInput: React.FC<AppTextInputProps> = ({ 
  containerStyle, 
  inputStyle, 
  error,
  rightElement,
  ...props 
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: error ? Spacing.s1 : 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background === '#FFFFFF' ? '#F3F4F6' : '#1C1C27',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: error ? colors.error : colors.border,
      height: 48,
    },
    input: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: Platform.OS === 'ios' ? Spacing.s3 : 0,
      color: colors.textPrimary,
      fontFamily: FontFamily.regular,
      fontSize: 16,
      includeFontPadding: false,
    },
    rightElementContainer: {
      paddingRight: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
        {rightElement && (
          <View style={styles.rightElementContainer}>
            {rightElement}
          </View>
        )}
      </View>
    </View>
  );
};

export default AppTextInput;
