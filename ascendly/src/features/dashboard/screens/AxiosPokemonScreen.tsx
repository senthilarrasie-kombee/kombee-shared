import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, Image, ActivityIndicator, ScrollView, RefreshControl, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppHeader, AppText} from '@shared/components';
import {useTheme, FontFamily} from '@shared/theme';
import {pokemonClient} from '@core/api/apiClient';

interface PokemonData {
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  abilities: Array<{
    ability: {name: string};
  }>;
  types: Array<{
    type: {name: string};
  }>;
}

const AxiosPokemonScreen: React.FC = () => {
  const {colors, isDark} = useTheme();
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPokemon = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await pokemonClient.get<PokemonData>('/pokemon/pikachu');
      setPokemon(response.data);
    } catch (error) {
      console.error('[PokeAPI] Fetch Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
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
        content: {
          padding: 20,
          alignItems: 'center',
        },
        card: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          borderRadius: 20,
          padding: 24,
          width: '100%',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 10},
          shadowOpacity: 0.1,
          shadowRadius: 15,
          elevation: 5,
        },
        image: {
          width: 200,
          height: 200,
          marginBottom: 16,
        },
        name: {
          fontSize: 32,
          fontFamily: FontFamily.semiBold,
          color: colors.textPrimary,
          textTransform: 'capitalize',
          marginBottom: 8,
        },
        typeContainer: {
          flexDirection: 'row',
          marginBottom: 20,
        },
        typeBadge: {
          backgroundColor: '#F59E0B',
          paddingVertical: 4,
          paddingHorizontal: 12,
          borderRadius: 20,
          marginHorizontal: 4,
        },
        typeText: {
          color: '#FFFFFF',
          fontSize: 14,
          fontFamily: FontFamily.semiBold,
          textTransform: 'capitalize',
        },
        statsRow: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 20,
          marginTop: 10,
        },
        statItem: {
          alignItems: 'center',
        },
        statLabel: {
          fontSize: 12,
          color: colors.textSecondary,
          marginBottom: 4,
        },
        statValue: {
          fontSize: 18,
          fontFamily: FontFamily.semiBold,
          color: colors.textPrimary,
        },
        sectionTitle: {
          alignSelf: 'flex-start',
          marginTop: 24,
          marginBottom: 12,
          fontSize: 20,
          fontFamily: FontFamily.semiBold,
          color: colors.textPrimary,
        },
        abilityList: {
          alignSelf: 'flex-start',
          width: '100%',
        },
        abilityItem: {
          backgroundColor: colors.background,
          padding: 12,
          borderRadius: 10,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: colors.border,
        },
      }),
    [colors, isDark]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Pokemon API Call" showBack />

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchPokemon(true)} colors={[colors.primary]} />
          }>
          {pokemon && (
            <>
              <View style={styles.card}>
                <Image
                  source={{uri: pokemon.sprites.other['official-artwork'].front_default}}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.name}>{pokemon.name}</Text>

                <View style={styles.typeContainer}>
                  {pokemon.types.map((t, idx) => (
                    <View key={idx} style={styles.typeBadge}>
                      <Text style={styles.typeText}>{t.type.name}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>HEIGHT</Text>
                    <Text style={styles.statValue}>{pokemon.height / 10} m</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>WEIGHT</Text>
                    <Text style={styles.statValue}>{pokemon.weight / 10} kg</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Abilities</Text>
              <View style={styles.abilityList}>
                {pokemon.abilities.map((a, idx) => (
                  <View key={idx} style={styles.abilityItem}>
                    <AppText style={{textTransform: 'capitalize'}}>{a.ability.name.replace('-', ' ')}</AppText>
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AxiosPokemonScreen;
