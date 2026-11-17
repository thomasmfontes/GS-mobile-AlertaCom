import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppStackParamList } from '../../types/navigation';
import { incidentService } from '../../services/incidentService';
import { Ocorrencia } from '../../types/incident';
import { IncidentCard } from '../../components/IncidentCard';
import { Loader } from '../../components/Loader';
import { CustomInput } from '../../components/CustomInput';
import { Colors } from '../../theme/Colors';

type NavProp = StackNavigationProp<AppStackParamList>;

const FILTROS_STATUS = [
  { label: 'Todos', value: '' },
  { label: 'Abertos', value: 'Aberta' },
  { label: 'Em vistoria', value: 'EmAtendimento' },
  { label: 'Resolvidos', value: 'Resolvida' },
];

export const IncidentsListScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 14, 46);

  const [incidents, setIncidents] = useState<Ocorrencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState('');
  const [busca, setBusca] = useState('');

  const loadIncidents = async () => {
    try {
      const data = await incidentService.getPaged(1, 30, statusFiltro || undefined);
      setIncidents(data.items || []);
    } catch (error) {
      console.error('Erro ao listar ocorrências:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadIncidents();
    }, [statusFiltro])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadIncidents();
  };

  const filteredItems = incidents.filter((item) => {
    if (!busca.trim()) return true;
    const term = busca.toLowerCase();
    return (
      item.titulo.toLowerCase().includes(term) ||
      item.bairro.toLowerCase().includes(term) ||
      item.endereco.toLowerCase().includes(term) ||
      item.protocolo.toLowerCase().includes(term)
    );
  });

  return (
    <View style={styles.container}>
      {/* Header Azul Marinho Consistente */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <Text style={styles.title}>Ocorrências</Text>
        <Text style={styles.subtitle}>Acompanhe os chamados registrados na cidade</Text>

        <CustomInput
          icon="search-outline"
          rightIcon={busca ? 'close-circle' : undefined}
          onRightIconPress={() => setBusca('')}
          placeholder="Buscar bairro, rua ou protocolo"
          value={busca}
          onChangeText={setBusca}
          containerStyle={{ marginTop: 12, marginBottom: 0 }}
        />
      </View>

      {/* Filtros Horizontais Limpos */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTROS_STATUS.map((f) => {
            const active = statusFiltro === f.value;
            return (
              <TouchableOpacity
                key={f.value}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setStatusFiltro(f.value)}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <Loader message="Carregando ocorrências..." />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <IncidentCard
              incident={item}
              onPress={() => navigation.navigate('IncidentDetail', { incident: item })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.defesaOrange]}
              tintColor={Colors.defesaBlue}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="search-outline" size={28} color={Colors.defesaBlue} />
              </View>
              <Text style={styles.emptyTitle}>Nenhuma ocorrência encontrada</Text>
              <Text style={styles.emptyText}>Tente outro termo ou altere o filtro.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.defesaBlue,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 13,
    color: '#CBD5E1',
    marginTop: 2,
  },
  filtersWrapper: {
    paddingTop: 14,
    paddingBottom: 4,
  },
  filtersRow: {
    paddingHorizontal: 18,
    gap: 8,
  },
  filterChip: {
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.defesaOrange,
    borderColor: Colors.defesaOrange,
  },
  filterText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 28,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 44,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 6,
  },
  emptyIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.defesaBlueLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default IncidentsListScreen;
