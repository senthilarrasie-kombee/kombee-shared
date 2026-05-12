import React, {useMemo, useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, BackHandler} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {storage, logAllStorageData} from '@core/storage';
import {setUser, setToast, signInWithEmailAction, signInWithGoogleAction} from '@store/reducers/rootSlice';
import {useAppDispatch} from '@store';
import {validationUtils} from '@shared/utils/validationUtils';
import {STRINGS} from '@shared/constants/strings';
import {useTheme, Spacing} from '@shared/theme';
import {AppButton, AppTextInput, AppText, ConfirmModal} from '@shared/components';
import {createStyles} from '../screens/LoginStyles';

interface LoginProps {
  onToggle: () => void;
  onSuccess: () => void;
}

const validationSchema = Yup.object().shape({
  email: validationUtils.email,
  password: validationUtils.password,
});

const Login: React.FC<LoginProps> = ({onToggle, onSuccess}) => {
  const {colors} = useTheme();
  const dispatch = useAppDispatch();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);

  useEffect(() => {
    const checkStorage = async () => {
      await logAllStorageData();
    };
    checkStorage();

    const backAction = () => {
      setIsExitModalVisible(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const onGoogleButtonPress = async () => {
    setGoogleLoading(true);
    const result = await dispatch(signInWithGoogleAction());
    setGoogleLoading(false);

    if (signInWithGoogleAction.fulfilled.match(result) && result.payload) {
      onSuccess();
    }
  };

  const formik = useFormik({
    initialValues: {email: '', password: ''},
    validationSchema,
    onSubmit: async values => {
      setLoginLoading(true);
      const result = await dispatch(signInWithEmailAction({email: values.email, password: values.password}));
      setLoginLoading(false);

      if (signInWithEmailAction.fulfilled.match(result) && result.payload) {
        onSuccess();
      }
    },
  });

  return (
    <View style={styles.content}>
      <AppText style={styles.title}>{STRINGS.AUTH.LABELS.LOGIN_TITLE}</AppText>
      <AppText style={styles.subtitle}>{STRINGS.AUTH.LABELS.LOGIN_SUBTITLE}</AppText>

      <AppTextInput
        placeholder={STRINGS.AUTH.LABELS.EMAIL_PLACEHOLDER}
        value={formik.values.email}
        onChangeText={text => formik.setFieldValue('email', text.replace(/\s/g, ''))}
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
        placeholder={STRINGS.AUTH.LABELS.PASSWORD_PLACEHOLDER}
        value={formik.values.password}
        onChangeText={text => formik.setFieldValue('password', text.replace(/\s/g, ''))}
        onBlur={formik.handleBlur('password')}
        autoCapitalize="none"
        secureTextEntry={!showPassword}
        maxLength={20}
        error={formik.touched.password && formik.errors.password}
        rightElement={
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />
      {formik.touched.password && formik.errors.password ? (
        <AppText style={styles.errorText}>{formik.errors.password}</AppText>
      ) : null}

      <AppButton
        disabled={!formik.isValid || !formik.dirty || loginLoading}
        title={loginLoading ? STRINGS.AUTH.LABELS.SIGNING_IN : STRINGS.AUTH.LABELS.SIGN_IN_BUTTON}
        onPress={formik.handleSubmit}
        style={{marginTop: Spacing.s2}}
      />

      <View style={localStyles.dividerContainer}>
        <View style={[localStyles.divider, {backgroundColor: colors.border}]} />
        <AppText style={localStyles.dividerText}>{STRINGS.AUTH.LABELS.OR}</AppText>
        <View style={[localStyles.divider, {backgroundColor: colors.border}]} />
      </View>

      <TouchableOpacity
        style={[localStyles.googleButton, {borderColor: colors.border}]}
        onPress={onGoogleButtonPress}
        disabled={googleLoading}>
        {googleLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <AppText style={localStyles.googleButtonText}>{STRINGS.AUTH.LABELS.GOOGLE_BUTTON}</AppText>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onToggle} style={localStyles.toggleContainer}>
        <AppText style={localStyles.toggleText}>
          {STRINGS.AUTH.LABELS.DONT_HAVE_ACCOUNT}
          <AppText style={localStyles.toggleLink}>{STRINGS.AUTH.LABELS.REGISTER_LINK}</AppText>
        </AppText>
      </TouchableOpacity>

      <ConfirmModal
        isVisible={isExitModalVisible}
        title={STRINGS.EXIT_APP.TITLE}
        message={STRINGS.EXIT_APP.MESSAGE}
        confirmText={STRINGS.EXIT_APP.CONFIRM}
        cancelText={STRINGS.LOGOUT.CANCEL}
        onConfirm={() => BackHandler.exitApp()}
        onCancel={() => setIsExitModalVisible(false)}
        type="logout"
      />
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
