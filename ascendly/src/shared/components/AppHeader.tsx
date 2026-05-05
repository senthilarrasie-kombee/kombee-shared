import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme, FontFamily } from '@shared/theme';
import AppText from './AppText';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  rightElement?: React.ReactNode;
  onBackPress?: () => void;
  onMenuPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  showBack = false, 
  showMenu = false,
  rightElement,
  onBackPress,
  onMenuPress
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleMenu = () => {
    if (onMenuPress) {
      onMenuPress();
    } else {
      (navigation as any).openDrawer();
    }
  };

  return (
    <View style={styles.header}>
      {showBack && (
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.primary + '10' }]}
          onPress={handleBack}
        >
          <Icon name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
      )}
      
      {showMenu && (
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.primary + '10' }]}
          onPress={handleMenu}
        >
          <Icon name="menu" size={24} color={colors.primary} />
        </TouchableOpacity>
      )}

      {!showBack && !showMenu && <View style={styles.placeholder} />}
      
      <AppText style={styles.headerTitle}>{title}</AppText>
      
      <View style={styles.rightSection}>
        {rightElement ? rightElement : <View style={styles.placeholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 64,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FontFamily.display,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  rightSection: {
    minWidth: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default AppHeader;
