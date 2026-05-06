import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Switch
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppText, AppButton, AppHeader } from '@shared/components';
import { useTheme, Spacing, FontFamily, FontSize } from '@shared/theme';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@app/routes';
import { useAppDispatch, useAppSelector } from '@store';
import { toggleDarkMode } from '@store/reducers/rootSlice';
import { createProfileStyles } from './ProfileStyles';

const { width } = Dimensions.get('window');

const AccountScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const reduxIsDark = useAppSelector((state) => state.root.isDarkMode);
  
  const styles = React.useMemo(() => createProfileStyles(colors), [colors]);

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
          
          <AppText style={styles.name}>Sara Wisher </AppText>
          <AppText style={styles.username}>@sara.wisher</AppText>
          
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

        <AppButton 
          title="Logout" 
          onPress={() => navigation.navigate(ROUTES.LOGIN)} 
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
    </View>
  );
};

export default AccountScreen;
