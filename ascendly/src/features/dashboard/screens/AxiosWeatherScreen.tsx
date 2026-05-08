import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  FlatList,
  RefreshControl,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components';
import { useTheme, FontFamily } from '@shared/theme';
import { weatherClient } from '@core/api/apiClient';

interface WeatherResponse {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
  hourly_units: {
    temperature_2m: string;
  };
}

const AxiosWeatherScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const [weatherData, setWeatherData] = useState<{time: string, temp: number}[]>([]);
  const [unit, setUnit] = useState('°C');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeather = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // Forecast for Chennai (13.08, 80.27)
      const response = await weatherClient.get<WeatherResponse>('/forecast', {
        params: {
          latitude: 13.08,
          longitude: 80.27,
          hourly: 'temperature_2m',
        }
      });
      
      const formatted = response.data.hourly.time.map((t, idx) => ({
        time: t.replace('T', ' '),
        temp: response.data.hourly.temperature_2m[idx]
      })).slice(0, 24); // Show first 24 hours
      
      setWeatherData(formatted);
      setUnit(response.data.hourly_units.temperature_2m);
    } catch (error) {
      console.error('[WeatherAPI] Fetch Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listContent: {
      padding: 16,
    },
    headerCard: {
      backgroundColor: colors.primary,
      padding: 20,
      borderRadius: 16,
      marginBottom: 20,
      alignItems: 'center',
    },
    locationText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontFamily: FontFamily.semiBold,
    },
    weatherRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    timeText: {
      fontSize: 14,
      color: colors.textPrimary,
      fontFamily: FontFamily.regular,
    },
    tempText: {
      fontSize: 16,
      fontFamily: FontFamily.semiBold,
      color: colors.primary,
    }
  }), [colors, isDark]);

  const renderWeatherItem = ({ item }: { item: {time: string, temp: number} }) => (
    <View style={styles.weatherRow}>
      <Text style={styles.timeText}>{item.time}</Text>
      <Text style={styles.tempText}>{item.temp}{unit}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Weather API Call" showBack />
      
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={weatherData}
          keyExtractor={(item) => item.time}
          renderItem={renderWeatherItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.headerCard}>
              <Text style={styles.locationText}>Chennai, India (13.08, 80.27)</Text>
              <Text style={{ color: '#FFFFFF', marginTop: 4 }}>Next 24 Hours Forecast</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchWeather(true)}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default AxiosWeatherScreen;
