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
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  alignLeft?: boolean;
  titleStyle?: any;
  onBackPress?: () => void;
  onMenuPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  showBack, 
  showMenu,
  leftElement,
  rightElement,
  alignLeft = false,
  titleStyle,
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
      {/* Title Layer - Absolutely positioned for perfect centering */}
      {!alignLeft && (
        <View style={styles.centerTitleContainer} pointerEvents="none">
          <AppText style={[styles.headerTitle, titleStyle, { color: colors.textPrimary }]}>
            {title}
          </AppText>
        </View>
      )}

      {/* Interactive Layer */}
      <View style={styles.leftContainer}>
        {leftElement ? (
          <View style={styles.leftSection}>
            {leftElement}
          </View>
        ) : (
          <>
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
          </>
        )}
        
        {alignLeft && (
          <AppText style={[styles.headerTitle, styles.leftTitle, titleStyle, { color: colors.textPrimary }]}>
            {title}
          </AppText>
        )}
      </View>
      
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
    position: 'relative',
  },
  centerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    zIndex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FontFamily.display,
    fontWeight: 'bold',
  },
  leftTitle: {
    fontSize: 24,
    marginLeft: 4,
  },
  placeholder: {
    width: 40,
  },
  leftSection: {
    minWidth: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 8,
  },
  rightSection: {
    minWidth: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 1,
  },
});

export default AppHeader;
