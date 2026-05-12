import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppHeader, AppButton, AppText} from '@shared/components';
import {useTheme} from '@shared/theme';
import {
  QuotesService,
  JsonPlaceholderService,
  PokemonService,
  ProductService,
  WeatherService,
} from '@core/structuredApi';

const StructuredApiScreen: React.FC = () => {
  const {colors} = useTheme();
  const [result, setResult] = useState<string>('Select an API to test');
  const [loading, setLoading] = useState(false);

  const quotesService = new QuotesService();
  const jsonService = new JsonPlaceholderService();
  const pokemonService = new PokemonService();
  const productService = new ProductService();
  const weatherService = new WeatherService();

  const handleTest = async (title: string, apiCall: () => Promise<any>) => {
    setLoading(true);
    setResult(`Testing ${title}...`);
    try {
      const data = await apiCall();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]} edges={['top']}>
      <AppHeader title="Structured APIs" showBack={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AppText style={styles.title}>Service + Repository Pattern</AppText>
        
        <View style={styles.buttonGrid}>
          <AppButton
            title="Get Quote"
            onPress={() => handleTest('Quotes', () => quotesService.fetchRandomQuote())}
            style={styles.button}
          />
          <AppButton
            title="Get Posts"
            onPress={() => handleTest('JSONPlaceholder', () => jsonService.fetchPosts())}
            style={styles.button}
          />
          <AppButton
            title="Get Pikachu"
            onPress={() => handleTest('Pokemon', () => pokemonService.fetchPokemonDetail('pikachu'))}
            style={styles.button}
          />
          <AppButton
            title="Get Products"
            onPress={() => handleTest('Products', () => productService.fetchProducts())}
            style={styles.button}
          />
          <AppButton
            title="Get Weather"
            onPress={() => handleTest('Weather', () => weatherService.fetchWeather(52.52, 13.41))}
            style={styles.button}
          />
        </View>

        <View style={[styles.resultContainer, {backgroundColor: colors.background, borderColor: colors.border}]}>
          {loading ? (
            <ActivityIndicator color={colors.primary} size="large" />
          ) : (
            <AppText style={styles.resultText}>{result}</AppText>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    width: '48%',
    marginBottom: 12,
  },
  resultContainer: {
    padding: 12,
    borderRadius: 8,
    minHeight: 200,
    borderWidth: 1,
  },
  resultText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
});

export default StructuredApiScreen;
