import React, { useState, useMemo } from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginType } from '@features/auth/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStyles } from './LoginStyles';
import { useTheme } from '@shared/theme';
import { ROUTES } from '@app/routes';
import LoginComponent from '../components/Login';
import RegisterComponent from '../components/Register';

const AuthScreen = ({ title, children }: LoginType) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleSuccess = () => {
    navigation.navigate(ROUTES.DRAWER);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.lightBlob} />
        <View style={styles.bigBubble} />
        <View style={styles.smallBubble} />
        <View style={styles.lightBlob2} />

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ flex: 1 }}>
                {isLogin ? (
                  <LoginComponent 
                    onToggle={() => setIsLogin(false)} 
                    onSuccess={handleSuccess} 
                  />
                ) : (
                  <RegisterComponent 
                    onToggle={() => setIsLogin(true)} 
                    onSuccess={handleSuccess} 
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;
