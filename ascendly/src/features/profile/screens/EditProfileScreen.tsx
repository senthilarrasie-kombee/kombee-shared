import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppText, AppButton, AppTextInput, AppHeader } from '@shared/components';
import { useTheme, Spacing, FontFamily } from '@shared/theme';
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createEditProfileStyles } from './ProfileStyles';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  bio: Yup.string(),
});

const EditProfileScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => createEditProfileStyles(colors), [colors]);

  const formik = useFormik({
    initialValues: { 
      name: 'Alvart Ainstain', 
      username: 'albart.ainstain',
      email: 'alvart.ainstain@example.com',
      bio: 'Professional Habit Tracker & Productivity Enthusiast.'
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Update profile:', values);
      navigation.goBack();
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top,}]}>
      {/* Header */}
      <AppHeader 
        title="Edit Profile" 
        showBack 
        rightElement={
          <TouchableOpacity onPress={formik.handleSubmit}>
            <AppText style={[styles.saveText, { color: colors.primary }]}>Save</AppText>
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarSection}>
            <View style={[styles.avatarContainer, { backgroundColor: '#7FB5FF' }]}>
              <Icon name="person" size={60} color="white" />
            </View>
            <TouchableOpacity style={styles.changeAvatarButton}>
              <AppText style={[styles.changeAvatarText, { color: colors.primary }]}>Change Profile Picture</AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <AppText style={styles.label}>Full Name</AppText>
            <AppTextInput
              placeholder="Full Name"
              value={formik.values.name}
              onChangeText={formik.handleChange('name')}
              onBlur={formik.handleBlur('name')}
              error={formik.touched.name && formik.errors.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <AppText style={styles.errorText}>{formik.errors.name}</AppText>
            ) : null}

            <AppText style={styles.label}>Username</AppText>
            <AppTextInput
              placeholder="Username"
              value={formik.values.username}
              onChangeText={formik.handleChange('username')}
              onBlur={formik.handleBlur('username')}
              error={formik.touched.username && formik.errors.username}
              autoCapitalize="none"
            />
            {formik.touched.username && formik.errors.username ? (
              <AppText style={styles.errorText}>{formik.errors.username}</AppText>
            ) : null}

            <AppText style={styles.label}>Email</AppText>
            <AppTextInput
              placeholder="Email"
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
              error={formik.touched.email && formik.errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {formik.touched.email && formik.errors.email ? (
              <AppText style={styles.errorText}>{formik.errors.email}</AppText>
            ) : null}

            <AppText style={styles.label}>Bio</AppText>
            <AppTextInput
              placeholder="Bio"
              value={formik.values.bio}
              onChangeText={formik.handleChange('bio')}
              onBlur={formik.handleBlur('bio')}
              multiline
              numberOfLines={4}
              inputStyle={styles.bioInput}
            />
          </View>

          <AppButton 
            title="Update Profile" 
            onPress={formik.handleSubmit}
            style={styles.updateButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditProfileScreen;
