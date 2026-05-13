import {useState, useEffect, useMemo, useCallback} from 'react';
import {BackHandler} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {apiClient} from '@core/api';
import {useTheme} from '@shared/theme';
import {ROUTES} from '@app/routes';
import {
  storage, 
  logAllStorageData, 
  asyncStorage, 
  ASYNC_STORAGE_KEYS, 
  syncQueueRepo,
  STORAGE_KEYS
} from '@core/storage';
import {LOCAL_APP_VERSION, ONLINE_APP_VERSION} from '@core/config/appVersion';
import {isDeviceRooted} from '@core';
import {createStyles} from '../screens/DashboardStyles';

export const useDashboard = () => {
  const dispatch = useDispatch();
  const {colors, isDark} = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();

  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const [quote, setQuote] = useState('');
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [syncQueueCount, setSyncQueueCount] = useState(0);
  const [count, setCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  // 0. Connectivity Check (Heartbeat)
  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        // Use a simple fetch with a short timeout to check internet
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        await fetch('https://www.google.com', { 
          method: 'HEAD', 
          mode: 'no-cors',
          signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        setIsOnline(true);
      } catch (e) {
        setIsOnline(false);
      }
    };

    checkConnectivity();
    const interval = setInterval(checkConnectivity, 5000);
    return () => clearInterval(interval);
  }, []);

  const incrementCount = () => setCount(prev => prev + 1);

  // 1. Sync Queue Polling
  useEffect(() => {
    const updateCount = async () => {
      try {
        const queue = await syncQueueRepo.findPending();
        setSyncQueueCount(queue.length);
      } catch (e) {
        console.warn('Failed to fetch sync queue count:', e);
      }
    };

    updateCount();
    const interval = setInterval(updateCount, 3000);
    return () => clearInterval(interval);
  }, []);

  // 2. Quote Fetching
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

  // 3. Mount Logic (Logging, Security, Rating)
  useEffect(() => {
    console.log(`[Version] Local: ${LOCAL_APP_VERSION}, Online: ${ONLINE_APP_VERSION}`);
    storage.set(STORAGE_KEYS.APP.LAST_LOGIN, new Date().toISOString());

    const updateRatingPromptCount = async () => {
      const currentCount = (await asyncStorage.getObject<number>(ASYNC_STORAGE_KEYS.RATING_PROMPT_COUNT)) || 0;
      await asyncStorage.setObject(ASYNC_STORAGE_KEYS.RATING_PROMPT_COUNT, currentCount + 1);
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

  // 4. Back Handler & Navigation Guards - Only active when dashboard is focused
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        setIsExitModalVisible(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
        // Allow navigation to Login or Reset actions
        if (e.data.action.type === 'RESET' || e.data.action.name === ROUTES.LOGIN) {
          return;
        }
        
        // If we have a screen to go back to in the stack, let it happen
        if (navigation.canGoBack()) {
          return;
        }

        e.preventDefault();
        setPendingAction(e.data.action);
        setIsExitModalVisible(true);
      });

      return () => {
        backHandler.remove();
        unsubscribe();
      };
    }, [navigation])
  );

  const confirmExit = () => {
    setIsExitModalVisible(false);
    BackHandler.exitApp();
  };

  const cancelExit = () => {
    setIsExitModalVisible(false);
    setPendingAction(null);
  };

  const navigateToProducts = () => navigation.navigate(ROUTES.AXIOS_PRODUCTS);
  const navigateToWeather = () => navigation.navigate(ROUTES.AXIOS_WEATHER);
  const navigateToStructuredApi = () => navigation.navigate(ROUTES.STRUCTURED_API);
  const navigateToStats = () => navigation.navigate(ROUTES.STATS);
  const navigateToAxiosExample = () => navigation.navigate(ROUTES.AXIOS_EXAMPLE);
  const navigateToPokemon = () => navigation.navigate(ROUTES.AXIOS_POKEMON);

  return {
    colors,
    isDark,
    styles,
    navigation,
    dispatch,
    isExitModalVisible,
    setIsExitModalVisible,
    quote,
    isQuoteLoading,
    syncQueueCount,
    fetchQuote,
    confirmExit,
    cancelExit,
    pendingAction,
    navigateToProducts,
    navigateToWeather,
    navigateToStructuredApi,
    navigateToStats,
    navigateToAxiosExample,
    navigateToPokemon,
    count,
    incrementCount,
    isOnline
  };
};
