import React, {useState, useMemo, useEffect} from 'react';
import {View, Text, TouchableOpacity, BackHandler, ActivityIndicator, ScrollView} from 'react-native';
import {apiClient} from '@core/api';
import {createStyles} from './DashboardStyles';
import {DashboardType} from '@shared/types/dashboard';
import {useTheme} from '@shared/theme';

import {AppButton, AppHeader, AppText} from '@shared/components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import ConfirmModal from '@shared/components/ConfirmModal';
import {STRINGS} from '@shared/constants/strings';
import {ROUTES} from '@app/routes';
import {storage, logAllStorageData, asyncStorage, ASYNC_STORAGE_KEYS} from '@core/storage';
import {STORAGE_KEYS} from '@core/storage/keys';
import {LOCAL_APP_VERSION, ONLINE_APP_VERSION} from '@core/config/appVersion';
import {isDeviceRooted} from '@core';

const Dashboard: React.FC<DashboardType> = ({children}) => {
  const [count, setCount] = useState(0);
  const {colors} = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [quote, setQuote] = useState('');
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);

  const fetchQuote = async () => {
    setIsQuoteLoading(true);
    try {
      const response = await apiClient.get('/api/random');
      if (response.data) {
        setQuote(`${response.data.quote} — ${response.data.author}`);
      }
    } catch (err: any) {
      console.log('[Dashboard] Quote fetch failed:', err.message);
    } finally {
      setIsQuoteLoading(false);
    }
  };

  useEffect(() => {
    // Log versions
    console.log(`[Version] Local: ${LOCAL_APP_VERSION}, Online: ${ONLINE_APP_VERSION}`);

    // Store last login
    storage.set(STORAGE_KEYS.APP.LAST_LOGIN, new Date().toISOString());

    // Update Rating Prompt Count
    const updateRatingPromptCount = async () => {
      const currentCount = (await asyncStorage.getObject<number>(ASYNC_STORAGE_KEYS.RATING_PROMPT_COUNT)) || 0;
      await asyncStorage.setObject(ASYNC_STORAGE_KEYS.RATING_PROMPT_COUNT, currentCount + 1);
      console.log(`[Dashboard] Visit count for rating: ${currentCount + 1}`);
    };

    const checkSecurity = async () => {
      const rooted = await isDeviceRooted('Dashboard Initialization');
      console.log(`[Security] Is device rooted: ${rooted}`);
    };

    updateRatingPromptCount();
    checkSecurity();
    logAllStorageData();
    asyncStorage.logAllData();
    fetchQuote();
  }, []);

  useEffect(() => {
    const backAction = () => {
      setIsExitModalVisible(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      // If we are navigating to the Login screen (likely a logout), don't show the exit modal
      if (e.data.action.type === 'RESET' || e.data.action.name === ROUTES.LOGIN) {
        return;
      }

      // Prevent default behavior of leaving the screen
      e.preventDefault();

      // Save the action to trigger it later if confirmed
      setPendingAction(e.data.action);
      setIsExitModalVisible(true);
    });

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation]);

  const confirmExit = () => {
    setIsExitModalVisible(false);
    // Exit the app entirely
    BackHandler.exitApp();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Dashboard" showMenu={true} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <AppText>API integration module - Using Axios</AppText>
        <View style={styles.quoteContainer}>
          {isQuoteLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Text style={styles.quoteText}>{quote || 'Loading inspiration...'}</Text>
              <TouchableOpacity onPress={fetchQuote}>
                <Text style={{color: colors.primary, fontWeight: 'bold'}}>Refresh Quote</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <Text style={styles.counterText}>{count}</Text>
        <AppButton
          title="Increment Counter"
          onPress={() => setCount(count + 1)}
          style={{paddingHorizontal: 30, marginBottom: 16}}
        />

        <AppButton
          title="Latest status"
          onPress={() => navigation.navigate(ROUTES.STATS)}
          style={{paddingHorizontal: 30, marginBottom: 16}}
        />

        <AppButton
          title="Axios API Call Example 1"
          onPress={() => navigation.navigate(ROUTES.AXIOS_EXAMPLE)}
          style={{paddingHorizontal: 30, marginBottom: 16}}
        />

        <AppButton
          title="Axios API Call Example 2"
          onPress={() => navigation.navigate(ROUTES.AXIOS_POKEMON)}
          style={{paddingHorizontal: 30, marginBottom: 16}}
        />

        <AppButton
          title="Axios API Call Example 3"
          onPress={() => navigation.navigate(ROUTES.AXIOS_PRODUCTS)}
          style={{paddingHorizontal: 30, marginBottom: 16}}
        />

        <AppButton
          title="Axios API Call Example 4"
          onPress={() => navigation.navigate(ROUTES.AXIOS_WEATHER)}
          style={{paddingHorizontal: 30, marginBottom: 16}}
        />

        <AppButton
          title="Structured API"
          onPress={() => navigation.navigate(ROUTES.STRUCTURED_API)}
          style={{paddingHorizontal: 30}}
        />
      </ScrollView>

      <ConfirmModal
        isVisible={isExitModalVisible}
        title={STRINGS.EXIT_APP.TITLE}
        message={STRINGS.EXIT_APP.MESSAGE}
        confirmText={STRINGS.EXIT_APP.CONFIRM}
        onConfirm={confirmExit}
        onCancel={() => setIsExitModalVisible(false)}
        type="info"
      />
    </SafeAreaView>
  );
};

export default Dashboard;
