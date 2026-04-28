import React, { useState, useEffect, useMemo } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginType } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStyles } from './styles';
import { useTheme } from '@/core/theme';
import { ROUTES } from '@/constants/routes';
import { AppButton } from '@/components';

const Login = ({ title, children }: LoginType) => {
  const [email, setEmail] = useState<string>('');
    const [Password, setPassword] = useState<string>('');

  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  
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


  const handleLogin = () => {
    navigation.navigate(ROUTES.MAIN_TAB);
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
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.content}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>Welcome to Sara Shopping!</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={colors.textSecondary}
                  value={Password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  secureTextEntry={true}
                />
              </View>

              <AppButton 
                title="Sign In"
                onPress={handleLogin}
                style={{ marginTop: 10 }}
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};


export default Login;

