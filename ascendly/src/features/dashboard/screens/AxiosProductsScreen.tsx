import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, Image, ActivityIndicator, FlatList, RefreshControl, StyleSheet, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppHeader} from '@shared/components';
import {useTheme, FontFamily} from '@shared/theme';
import {dummyJsonClient} from '@core/api/apiClient';

const {width} = Dimensions.get('window');

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
  brand: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const AxiosProductsScreen: React.FC = () => {
  const {colors, isDark} = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await dummyJsonClient.get<ProductsResponse>('/products?limit=10');
      setProducts(response.data.products);
    } catch (error) {
      console.error('[DummyJSON] Fetch Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
        productCard: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          borderRadius: 16,
          marginBottom: 16,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.border,
          flexDirection: 'row',
        },
        thumbnail: {
          width: 100,
          height: 100,
          backgroundColor: isDark ? '#374151' : '#F3F4F6',
        },
        details: {
          flex: 1,
          padding: 12,
          justifyContent: 'center',
        },
        title: {
          fontSize: 16,
          fontFamily: FontFamily.semiBold,
          color: colors.textPrimary,
          marginBottom: 4,
        },
        category: {
          fontSize: 12,
          color: colors.textSecondary,
          textTransform: 'uppercase',
          marginBottom: 4,
        },
        price: {
          fontSize: 18,
          fontFamily: FontFamily.semiBold,
          color: colors.primary,
        },
      }),
    [colors, isDark]
  );

  const renderProduct = ({item}: {item: Product}) => (
    <View style={styles.productCard}>
      <Image source={{uri: item.thumbnail}} style={styles.thumbnail} />
      <View style={styles.details}>
        <Text style={styles.category}>{item.brand || item.category}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Products API Call" showBack />

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchProducts(true)} colors={[colors.primary]} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default AxiosProductsScreen;
