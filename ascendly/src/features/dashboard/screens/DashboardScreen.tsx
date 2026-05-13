import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {DashboardType} from '@shared/types/dashboard';

import {AppButton, AppHeader, AppText} from '@shared/components';
import {SafeAreaView} from 'react-native-safe-area-context';
import ConfirmModal from '@shared/components/ConfirmModal';
import {STRINGS} from '@shared/constants/strings';
import {logAllStorageData} from '@core/storage';
import {setToast} from '@store/reducers/rootSlice';

import {useDashboard} from '../hooks/useDashboard';

const Dashboard: React.FC<DashboardType> = ({children}) => {
  const {
    colors,
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
    navigateToProducts,
    navigateToWeather,
    navigateToStructuredApi,
    navigateToStats,
    navigateToAxiosExample,
    navigateToPokemon,
    count,
    incrementCount,
    isOnline
  } = useDashboard();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Dashboard" showMenu={true} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {!isOnline && (
          <View style={{
            backgroundColor: '#FF3B30', 
            padding: 10, 
            borderRadius: 12, 
            marginBottom: 16, 
            flexDirection: 'row', 
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon name="wifi-outline" size={20} color="white" style={{marginRight: 8}} />
            <AppText style={{color: 'white', fontWeight: 'bold'}}>
              {STRINGS.SYNC.OFFLINE_MODE}
            </AppText>
          </View>
        )}

        {syncQueueCount > 0 && (
          <View style={{
            backgroundColor: '#FF9500', 
            padding: 10, 
            borderRadius: 12, 
            marginBottom: 16, 
            flexDirection: 'row', 
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Icon name="cloud-upload-outline" size={20} color="white" style={{marginRight: 8}} />
            <AppText style={{color: 'white', fontWeight: 'bold'}}>
              {STRINGS.SYNC.PENDING_ITEMS(syncQueueCount)}
            </AppText>
          </View>
        )}

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
          onPress={incrementCount}
          style={{paddingHorizontal: 30, marginBottom: 16}}
        />

        <AppButton
          title="Latest status"
          onPress={navigateToStats}
          style={{paddingHorizontal: 30, marginBottom: 16}}
        />

        <AppButton
          title="Axios API Call Example 1"
          onPress={navigateToAxiosExample}
          style={{paddingHorizontal: 30, marginBottom: 16}}
        />

        <AppButton
          title="Axios API Call Example 2"
          onPress={navigateToPokemon}
          style={{paddingHorizontal: 30, marginBottom: 16}}
        />

        <AppButton
          title="Axios API Call Example 3"
          onPress={navigateToProducts}
          style={{paddingHorizontal: 30, marginBottom: 16}}
        />

        <AppButton
          title="Axios API Call Example 4"
          onPress={navigateToWeather}
          style={{paddingHorizontal: 30, marginBottom: 16}}
        />

        <AppButton
          title="Structured API"
          onPress={navigateToStructuredApi}
          style={{paddingHorizontal: 30, marginBottom: 16}}
        />

        <AppButton
          title="Log All Storage Data"
          onPress={() => {
            dispatch(setToast('Logging data to console...'));
            logAllStorageData();
          }}
          style={{paddingHorizontal: 30, backgroundColor: '#666'}}
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
