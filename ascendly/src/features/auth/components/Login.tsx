import React, { useMemo, useEffect, useState } from 'react';
import { 
  View, 
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signInWithGoogle, signInWithEmail } from '@core/firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '@store/reducers/rootSlice';
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
  const dispatch = useDispatch();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const onGoogleButtonPress = async () => {
    try {
      setGoogleLoading(true);
      const userCredential = await signInWithGoogle();
      
      if (userCredential) {
        // Dispatch user data to store
        dispatch(setUser(userCredential.user));
        onSuccess();
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoginLoading(true);
        const userCredential = await signInWithEmail(values.email, values.password);
        if (userCredential) {
          dispatch(setUser(userCredential.user));
          onSuccess();
        }
      } catch (error) {
        console.error('Email Login Error:', error);
      } finally {
        setLoginLoading(false);
      }
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
        disabled={!formik.isValid || !formik.dirty || loginLoading}
        title={loginLoading ? "Signing In..." : "Sign In"}
        onPress={formik.handleSubmit}
        style={{ marginTop: Spacing.s2 }}
      />

      <View style={localStyles.dividerContainer}>
        <View style={[localStyles.divider, { backgroundColor: colors.border }]} />
        <AppText style={localStyles.dividerText}>OR</AppText>
        <View style={[localStyles.divider, { backgroundColor: colors.border }]} />
      </View>

      <TouchableOpacity 
        style={[localStyles.googleButton, { borderColor: colors.border }]} 
        onPress={onGoogleButtonPress}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <AppText style={localStyles.googleButtonText}>Continue with Google</AppText>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onToggle} style={localStyles.toggleContainer}>
        <AppText style={localStyles.toggleText}>
          Don't have an account? <AppText style={localStyles.toggleLink}>Register</AppText>
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: '#999999',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
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
