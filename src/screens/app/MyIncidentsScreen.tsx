import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
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
import { Colors } from '../../theme/Colors';

type NavProp = StackNavigationProp<AppStackParamList>;

export const MyIncidentsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 14, 46);

  const [myIncidents, setMyIncidents] = useState<Ocorrencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await incidentService.getMyIncidents();
      setMyIncidents(data);
    } catch (error) {
      console.error('Erro ao carregar meus chamados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Meus chamados</Text>
            <Text style={styles.subtitle}>Relatos que você enviou à Defesa Civil</Text>
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{myIncidents.length}</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <Loader message="Carregando seus chamados..." />
      ) : (
        <FlatList
          data={myIncidents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <IncidentCard
              incident={item}
              onPress={() => navigation.navigate('IncidentDetail', { incident: item })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
              <View style={styles.emptyIconBg}>
                <Ionicons name="folder-open-outline" size={30} color={Colors.defesaOrange} />
              </View>
              <Text style={styles.emptyTitle}>Nenhum chamado enviado</Text>
              <Text style={styles.emptyText}>
                Quando você registrar uma ocorrência na aba Reportar, ela aparecerá aqui para acompanhamento.
              </Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  countPill: {
    minWidth: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  listContent: {
    padding: 18,
    paddingBottom: 28,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 44,
    paddingHorizontal: 24,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 8,
  },
  emptyIconBg: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: Colors.defesaOrangeLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 19,
  },
});

export default MyIncidentsScreen;
