import React, { useMemo } from 'react';
import { 
  View, 
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTheme, Spacing } from '@shared/theme';
import { AppButton, AppTextInput, AppText } from '@shared/components';
import { createStyles } from '../screens/LoginStyles';

interface LoginProps {
  onToggle: () => void;
  onSuccess: () => void;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required')
    .transform((value) => value.replace(/\s/g, '')),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .transform((value) => value.replace(/\s/g, '')),
});

const Login: React.FC<LoginProps> = ({ onToggle, onSuccess }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [showPassword, setShowPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: (values) => {
      console.log('Login values:', values);
      onSuccess();
    },
  });

  return (
    <View style={styles.content}>
      <AppText style={styles.title}>Login</AppText>
      <AppText style={styles.subtitle}>Welcome to Ascendly!</AppText>

      <AppTextInput
        placeholder="Email"
        value={formik.values.email}
        onChangeText={(text) => formik.setFieldValue('email', text.replace(/\s/g, ''))}
        onBlur={formik.handleBlur('email')}
        autoCapitalize="none"
        keyboardType="email-address"
        maxLength={30}
        error={formik.touched.email && formik.errors.email}
      />
      {formik.touched.email && formik.errors.email ? (
        <AppText style={styles.errorText}>{formik.errors.email}</AppText>
      ) : null}

      <AppTextInput
        placeholder="Password"
        value={formik.values.password}
        onChangeText={(text) => formik.setFieldValue('password', text.replace(/\s/g, ''))}
        onBlur={formik.handleBlur('password')}
        autoCapitalize="none"
        secureTextEntry={!showPassword}
        maxLength={20}
        error={formik.touched.password && formik.errors.password}
        rightElement={
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        }
      />
      {formik.touched.password && formik.errors.password ? (
        <AppText style={styles.errorText}>{formik.errors.password}</AppText>
      ) : null}

      <AppButton 
        disabled={!formik.isValid || !formik.dirty}
        title="Sign In"
        onPress={formik.handleSubmit}
        style={{ marginTop: Spacing.s2 }}
      />

      <TouchableOpacity onPress={onToggle} style={localStyles.toggleContainer}>
        <AppText style={localStyles.toggleText}>
          Don't have an account? <AppText style={localStyles.toggleLink}>Register</AppText>
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  toggleContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: '#666666',
  },
  toggleLink: {
    color: '#1E5BFF',
    fontWeight: 'bold',
  },
});

export default Login;
