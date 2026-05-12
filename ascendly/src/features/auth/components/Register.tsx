import React, {useMemo} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useAppDispatch} from '@store';
import {setUser, setToast, signUpWithEmailAction} from '@store/reducers/rootSlice';
import {validationUtils} from '@shared/utils/validationUtils';
import {STRINGS} from '@shared/constants/strings';
import {useTheme, Spacing} from '@shared/theme';
import {AppButton, AppTextInput, AppText} from '@shared/components';
import {createStyles} from '../screens/LoginStyles';

interface RegisterProps {
  onToggle: () => void;
  onSuccess: () => void;
}

const validationSchema = Yup.object().shape({
  name: validationUtils.name,
  email: validationUtils.email,
  password: validationUtils.password,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const Register: React.FC<RegisterProps> = ({onToggle, onSuccess}) => {
  const {colors} = useTheme();
  const dispatch = useAppDispatch();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [registerLoading, setRegisterLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {name: '', email: '', password: '', confirmPassword: ''},
    validationSchema,
    onSubmit: async values => {
      setRegisterLoading(true);
      const result = await dispatch(
        signUpWithEmailAction({email: values.email, password: values.password, name: values.name})
      );
      setRegisterLoading(false);

      if (signUpWithEmailAction.fulfilled.match(result) && result.payload) {
        onSuccess();
      }
    },
  });

  return (
    <View style={styles.content}>
      <AppText style={styles.title}>{STRINGS.AUTH.LABELS.REGISTER_TITLE}</AppText>
      <AppText style={styles.subtitle}>{STRINGS.AUTH.LABELS.REGISTER_SUBTITLE}</AppText>

      <AppTextInput
        placeholder={STRINGS.AUTH.LABELS.NAME_PLACEHOLDER}
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
        placeholder={STRINGS.AUTH.LABELS.EMAIL_PLACEHOLDER}
        value={formik.values.email}
        onChangeText={text => formik.setFieldValue('email', text.replace(/\s/g, ''))}
        onBlur={formik.handleBlur('email')}
        autoCapitalize="none"
        keyboardType="email-address"
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

      <AppTextInput
        placeholder={STRINGS.AUTH.LABELS.CONFIRM_PASSWORD_PLACEHOLDER}
        value={formik.values.confirmPassword}
        onChangeText={text => formik.setFieldValue('confirmPassword', text.replace(/\s/g, ''))}
        onBlur={formik.handleBlur('confirmPassword')}
        autoCapitalize="none"
        secureTextEntry={!showConfirmPassword}
        error={formik.touched.confirmPassword && formik.errors.confirmPassword}
        rightElement={
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
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
        title={registerLoading ? STRINGS.AUTH.LABELS.CREATING_ACCOUNT : STRINGS.AUTH.LABELS.CREATE_ACCOUNT_BUTTON}
        onPress={formik.handleSubmit}
        style={{marginTop: Spacing.s2}}
      />

      <TouchableOpacity onPress={onToggle} style={localStyles.toggleContainer}>
        <AppText style={localStyles.toggleText}>
          {STRINGS.AUTH.LABELS.ALREADY_HAVE_ACCOUNT}
          <AppText style={localStyles.toggleLink}>{STRINGS.AUTH.LABELS.LOGIN_LINK}</AppText>
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
