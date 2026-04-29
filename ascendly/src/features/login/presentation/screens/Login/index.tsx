import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Text
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginType } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStyles } from './styles';
import { useTheme } from '@/core/theme';
import { ROUTES } from '@/constants/routes';
import { AppButton, AppTextInput, AppText } from '@/components';
import { Spacing } from '@/core/theme';

const Login = ({ title, children }: LoginType) => {
  const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
const [enableSignIn, setEnableSigIn] = useState<boolean>(false);
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  useEffect(() => {

    // dev: JS/TS concepts
    // dev: async program
    const fetchData = async () => {
      console.log("Step 1");
await new Promise(resolve => setTimeout(() => {console.log("Step 2"); resolve(null); }, 1000));
      console.log("Step 3");
    };
    fetchData();
  }, []);

  useEffect(() => {
    if(password.trim().length >0 && email.trim().length >0) {
    setEnableSigIn(true);
  }else{
    setEnableSigIn(false);
  }
  }, [password, email]);


  const handleLogin = () => {
    navigation.navigate(ROUTES.MAIN_TAB);
  };

  const handleEmailChange = (text: string) => {
    const cleanText = text.replace(/\s/g, '');
    if(cleanText.includes('@')  || cleanText.length === 0) {
      setEmailError('');
    }else{
      setEmailError('Please enter a valid email');
    }
    setEmail(cleanText);
  };

  const handlePasswordChange = (text: string) => {
    const cleanText = text.replace(/\s/g, '');
    if(cleanText.length === 0 || cleanText.length >= 6) {
      setPasswordError('');
    } else {
      setPasswordError('Password must be at least 6 characters');
    }
    setPassword(cleanText);
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
              <View style={styles.content}>
                <AppText style={styles.title}>Login</AppText>
                <AppText style={styles.subtitle}>Welcome to Ascendly!</AppText>

                <AppTextInput
                  placeholder="Email"
                  containerStyle={{marginBottom: emailError ? 0 : 20 }}
                  value={email}
                  onChangeText={handleEmailChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  maxLength={30}
                />
                {emailError ? <AppText style={{ color: 'red' , marginTop:0, paddingTop:0, marginBottom: 20, paddingBottom:0}}>{emailError}</AppText> : null}
                <AppTextInput
                  placeholder="Password"
                  containerStyle={{marginBottom: passwordError ? 0 : 20 }}
                  value={password}
                  onChangeText={handlePasswordChange}
                  autoCapitalize="none"
                  secureTextEntry={true}
                  maxLength={20}
                />
                {passwordError ? <AppText style={{ color: 'red' , marginTop:0, paddingTop:0, marginBottom: 20, paddingBottom:0}}>{passwordError}</AppText> : null}
                <AppButton 
                disabled={!enableSignIn}
                  title="Sign In"
                  onPress={handleLogin}
                  style={{ marginTop: Spacing.s2 }}
                />
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};


export default Login;

