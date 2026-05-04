import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppText, AppButton, AppHeader } from '@shared/components';
import { useTheme, Spacing, FontFamily } from '@shared/theme';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@app/routes';
import { createProfileStyles } from './ProfileStyles';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => createProfileStyles(colors), [colors]);

  const menuItems = [
    { id: 'team', title: 'Join a Team', icon: 'chevron-forward' },
    { id: 'settings', title: 'Settings', icon: 'chevron-forward' },
    { id: 'task', title: 'My Task', icon: 'chevron-forward' },
  ];

  const StatItem = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
    <View style={styles.statItem}>
      <View style={[styles.statIconContainer, { backgroundColor: colors.background === '#FFFFFF' ? '#F3F4F6' : '#1C1C27' }]}>
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
      <AppHeader title="Profile" showBack />

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
          <StatItem label="On Going" value="5" icon="time-outline" />
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <StatItem label="Total Complete" value="25" icon="checkmark-done-outline" />
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.menuItem, { backgroundColor: colors.background === '#FFFFFF' ? '#FFFFFF' : '#1C1C27', borderColor: colors.border }]}
              onPress={() => {
                if (item.id === 'settings') {
                  navigation.navigate(ROUTES.SETTINGS);
                }
              }}
            >
              <AppText style={styles.menuItemTitle}>{item.title}</AppText>
              <Icon name={item.icon} size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

    </View>
  );
};

export default ProfileScreen;
