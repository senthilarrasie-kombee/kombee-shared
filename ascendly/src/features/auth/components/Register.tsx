import React, { useMemo } from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signUpWithEmail } from '@core/firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '@store/reducers/rootSlice';
import { useTheme, Spacing } from '@shared/theme';
import { AppButton, AppTextInput, AppText } from '@shared/components';
import { createStyles } from '../screens/LoginStyles';

interface RegisterProps {
  onToggle: () => void;
  onSuccess: () => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required')
    .transform((value) => value.replace(/\s/g, '')),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .transform((value) => value.replace(/\s/g, '')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const Register: React.FC<RegisterProps> = ({ onToggle, onSuccess }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [registerLoading, setRegisterLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setRegisterLoading(true);
        const userCredential = await signUpWithEmail(values.email, values.password, values.name);
        if (userCredential) {
          dispatch(setUser(userCredential.user));
          onSuccess();
        }
      } catch (error) {
        console.error('Registration Error:', error);
      } finally {
        setRegisterLoading(false);
      }
    },
  });

  return (
    <View style={styles.content}>
      <AppText style={styles.title}>Register</AppText>
      <AppText style={styles.subtitle}>Create your account to get started!</AppText>

      <AppTextInput
        placeholder="Full Name"
        value={formik.values.name}
        onChangeText={formik.handleChange('name')}
        onBlur={formik.handleBlur('name')}
        autoCapitalize="words"
        error={formik.touched.name && formik.errors.name}
      />
      {formik.touched.name && formik.errors.name ? (
        <AppText style={styles.errorText}>{formik.errors.name}</AppText>
      ) : null}

      <AppTextInput
        placeholder="Email"
        value={formik.values.email}
        onChangeText={(text) => formik.setFieldValue('email', text.replace(/\s/g, ''))}
        onBlur={formik.handleBlur('email')}
        autoCapitalize="none"
        keyboardType="email-address"
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

      <AppTextInput
        placeholder="Confirm Password"
        value={formik.values.confirmPassword}
        onChangeText={(text) => formik.setFieldValue('confirmPassword', text.replace(/\s/g, ''))}
        onBlur={formik.handleBlur('confirmPassword')}
        autoCapitalize="none"
        secureTextEntry={!showConfirmPassword}
        error={formik.touched.confirmPassword && formik.errors.confirmPassword}
        rightElement={
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons 
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        }
      />
      {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
        <AppText style={styles.errorText}>{formik.errors.confirmPassword}</AppText>
      ) : null}

      <AppButton 
        disabled={!formik.isValid || !formik.dirty || registerLoading}
        title={registerLoading ? "Creating Account..." : "Create Account"}
        onPress={formik.handleSubmit}
        style={{ marginTop: Spacing.s2 }}
      />

      <TouchableOpacity onPress={onToggle} style={localStyles.toggleContainer}>
        <AppText style={localStyles.toggleText}>
          Already have an account? <AppText style={localStyles.toggleLink}>Login</AppText>
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

export default Register;
