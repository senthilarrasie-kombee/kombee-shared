import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, FontFamily, FontSize } from '@shared/theme';
import AppText from './AppText';

interface ConfirmModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'info' | 'logout' | 'success';
  showCancel?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger',
  showCancel = true
}) => {
  const { colors, isDark } = useTheme();
  const isDanger = type === 'danger';
  const isLogout = type === 'logout';
  const isSuccess = type === 'success';

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.modalContainer, 
          { backgroundColor: isDark ? '#1E1E26' : '#FFFFFF' }
        ]}>
          <View style={[
            styles.iconContainer, 
            { backgroundColor: isDanger ? '#EF444415' : isLogout ? colors.primary + '15' : isSuccess ? '#10B98115' : colors.primary + '15' }
          ]}>
            <Icon 
              name={isDanger ? "trash-outline" : isLogout ? "log-out-outline" : isSuccess ? "checkmark-circle-outline" : "information-circle-outline"} 
              size={32} 
              color={isDanger ? "#EF4444" : isLogout ? colors.primary : isSuccess ? "#10B981" : colors.primary} 
            />
          </View>

          <AppText style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </AppText>
          
          <AppText style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </AppText>

          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton, { borderColor: isDark ? '#3F3F46' : '#E2E8F0' }]} 
                onPress={onCancel}
              >
                <AppText style={[styles.buttonText, { color: colors.textSecondary }]}>
                  {cancelText}
                </AppText>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.confirmButton, 
                { backgroundColor: isDanger ? '#EF4444' : isSuccess ? '#10B981' : colors.primary }
              ]} 
              onPress={onConfirm}
            >
              <AppText style={[styles.buttonText, { color: '#FFFFFF' }]}>
                {confirmText}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.semiBold,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    marginRight: 12,
    borderWidth: 1,
  },
  confirmButton: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
  },
});

export default ConfirmModal;
