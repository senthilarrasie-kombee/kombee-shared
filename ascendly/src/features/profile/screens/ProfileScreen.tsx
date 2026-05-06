import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Switch,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppText, AppButton, AppHeader } from '@shared/components';
import ConfirmModal from '@shared/components/ConfirmModal';
import { STRINGS } from '@shared/constants/strings';
import { useTheme, Spacing, FontFamily, FontSize } from '@shared/theme';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@app/routes';
import { useAppDispatch, useAppSelector } from '@store';
import { toggleDarkMode, logout } from '@store/reducers/rootSlice';
import { signOut } from '@core/firebase/auth';
import { bulkUploadHabits, deleteUserHabits } from '@core/firebase/firestore';
import habitsData from '../../habits/data/habits.json';
import { createProfileStyles } from './ProfileStyles';

const { width } = Dimensions.get('window');

const AccountScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const reduxIsDark = useAppSelector((state) => state.root.isDarkMode);
  const user = useAppSelector((state) => state.root.user);
  
  const styles = React.useMemo(() => createProfileStyles(colors), [colors]);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = React.useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = React.useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = React.useState(false);
  const [successConfig, setSuccessConfig] = React.useState({ title: '', message: '' });
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const handleUpdateHabits = async () => {
    try {
      if (!user?.uid) return;
      setIsUploading(true);
      await bulkUploadHabits(user.uid, habitsData);
      setIsUpdateModalVisible(false);
      setSuccessConfig({
        title: 'Update Successful',
        message: 'Habits data has been synchronized successfully!'
      });
      setIsSuccessModalVisible(true);
    } catch (error) {
      console.error('Update habits failed:', error);
      Alert.alert('Error', 'Failed to update habits data.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteHabits = async () => {
    try {
      if (!user?.uid) return;
      setIsDeleting(true);
      await deleteUserHabits(user.uid);
      setIsDeleteModalVisible(false);
      setSuccessConfig({
        title: 'Deletion Successful',
        message: 'All habits data has been permanently removed.'
      });
      setIsSuccessModalVisible(true);
    } catch (error) {
      console.error('Delete habits failed:', error);
      Alert.alert('Error', 'Failed to delete habits data.');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmLogout = async () => {
    try {
      setIsLogoutModalVisible(false);
      await signOut();
      dispatch(logout());
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.LOGIN }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { id: 'team', title: 'Join a Team', icon: 'people-outline' },
    { id: 'task', title: 'My Task', icon: 'list-outline' },
  ];

  const StatItem = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
    <View style={styles.statItem}>
      <View style={[styles.statIconContainer, { backgroundColor: isDark ? '#1C1C27' : '#F3F4F6' }]}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <AppText style={styles.statValue}>{value}</AppText>
      <AppText style={styles.statLabel}>{label}</AppText>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Decorative Blobs */}
      <View style={[styles.blob, { backgroundColor: colors.primary, opacity: 0.08, top: -50, right: -100, width: 250, height: 250, borderRadius: 125 }]} />
      <View style={[styles.blob, { backgroundColor: '#FFD93D', opacity: 0.12, bottom: 50, left: -80, width: 200, height: 200, borderRadius: 100 }]} />
      
      {/* Header */}
      <AppHeader title="Account" showBack={false} showMenu={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <View style={[styles.avatarContainer, { backgroundColor: '#7FB5FF' }]}>
            <Icon name="person" size={80} color="white" />
          </View>
          
          <AppText style={styles.name}>{user?.firstName} {user?.lastName}</AppText>
          <AppText style={styles.username}>{user?.email}</AppText>
          
          <TouchableOpacity 
            style={[styles.editButton, { borderColor: colors.primary }]}
            onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
          >
            <AppText style={[styles.editButtonText, { color: colors.primary }]}>Edit</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <StatItem label="Ongoing" value="5" icon="time-outline" />
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <StatItem label="Complete" value="25" icon="checkmark-done-outline" />
        </View>

        {/* Preferences Section */}
        <View style={[styles.section, { marginTop: 32 }]}>
          <AppText style={[styles.sectionTitle, { color: colors.textPrimary, marginLeft: 4, marginBottom: 12, fontSize: FontSize.lg, fontFamily: FontFamily.semiBold }]}>
            Preferences
          </AppText>
          <View style={[styles.menuItem, { backgroundColor: isDark ? '#1C1C27' : '#FFFFFF', borderColor: colors.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name={isDark ? "moon" : "sunny-outline"} size={20} color={colors.primary} style={{ marginRight: 12 }} />
              <AppText style={styles.menuItemTitle}>Dark Mode</AppText>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: colors.primary + '80' }}
              thumbColor={reduxIsDark ? colors.primary : '#f4f3f4'}
              onValueChange={(val) => { dispatch(toggleDarkMode()); }}
              value={reduxIsDark}
            />
          </View>
        </View>

        {/* Menu Section */}
        <View style={[styles.menuContainer, { marginTop: 20 }]}>
          <AppText style={[styles.sectionTitle, { color: colors.textPrimary, marginLeft: 4, marginBottom: 12, fontSize: FontSize.lg, fontFamily: FontFamily.semiBold }]}>
            Community & Tasks
          </AppText>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.menuItem, { backgroundColor: isDark ? '#1C1C27' : '#FFFFFF', borderColor: colors.border }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name={item.icon} size={20} color={colors.primary} style={{ marginRight: 12 }} />
                <AppText style={styles.menuItemTitle}>{item.title}</AppText>
              </View>
              <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Admin Section */}
        {user?.loginType === 'admin' && (
          <View style={[styles.section, { marginTop: 20 }]}>
            <AppText style={[styles.sectionTitle, { color: colors.textPrimary, marginLeft: 4, marginBottom: 12, fontSize: FontSize.lg, fontFamily: FontFamily.semiBold }]}>
              Admin
            </AppText>
            <TouchableOpacity 
              style={[styles.menuItem, { backgroundColor: isDark ? '#1C1C27' : '#FFFFFF', borderColor: colors.border }]}
              onPress={() => setIsUpdateModalVisible(true)}
              disabled={isUploading}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="cloud-upload-outline" size={20} color={colors.primary} style={{ marginRight: 12 }} />
                <AppText style={styles.menuItemTitle}>
                  {isUploading ? "Uploading..." : "Update Habits Data"}
                </AppText>
              </View>
              <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, { backgroundColor: isDark ? '#1C1C27' : '#FFFFFF', borderColor: colors.border, marginTop: 12 }]}
              onPress={() => setIsDeleteModalVisible(true)}
              disabled={isDeleting}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="trash-outline" size={20} color="#EF4444" style={{ marginRight: 12 }} />
                <AppText style={[styles.menuItemTitle, { color: '#EF4444' }]}>
                  {isDeleting ? "Deleting..." : "Delete Habits Data"}
                </AppText>
              </View>
              <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        <AppButton 
          title="Logout" 
          onPress={handleLogout} 
          style={{ 
            marginTop: 40, 
            marginHorizontal: 16,
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: '#EF4444',
            shadowColor: 'transparent',
            elevation: 0
          }}
          textStyle={{ color: '#EF4444' }}
        />
      </ScrollView>

      <ConfirmModal
        isVisible={isLogoutModalVisible}
        title={STRINGS.LOGOUT.TITLE}
        message={STRINGS.LOGOUT.MESSAGE}
        confirmText={STRINGS.LOGOUT.CONFIRM}
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutModalVisible(false)}
        type="logout"
      />

      <ConfirmModal
        isVisible={isDeleteModalVisible}
        title="Delete All Habits?"
        message="This will permanently remove all your habit records. This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteHabits}
        onCancel={() => setIsDeleteModalVisible(false)}
        type="danger"
      />

      <ConfirmModal
        isVisible={isUpdateModalVisible}
        title="Update Habits Data?"
        message="This will sync the latest habit configurations from the local data source to your profile."
        confirmText="Update"
        onConfirm={handleUpdateHabits}
        onCancel={() => setIsUpdateModalVisible(false)}
        type="logout"
      />

      <ConfirmModal
        isVisible={isSuccessModalVisible}
        title={successConfig.title}
        message={successConfig.message}
        confirmText="OK"
        onConfirm={() => setIsSuccessModalVisible(false)}
        onCancel={() => setIsSuccessModalVisible(false)}
        showCancel={false}
        type="success"
      />
    </View>
  );
};

export default AccountScreen;
