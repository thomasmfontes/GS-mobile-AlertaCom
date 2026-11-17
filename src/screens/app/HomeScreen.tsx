import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { incidentService } from '../../services/incidentService';
import { alertService } from '../../services/alertService';
import { Ocorrencia, AlertaClimatico } from '../../types/incident';
import { IncidentCard } from '../../components/IncidentCard';
import { AlertBanner } from '../../components/AlertBanner';
import { Loader } from '../../components/Loader';
import { Colors } from '../../theme/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ALERT_CARD_WIDTH = Math.min(SCREEN_WIDTH - 56, 310);

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const [alertas, setAlertas] = useState<AlertaClimatico[]>([]);
  const [recentes, setRecentes] = useState<Ocorrencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const topPadding = Math.max(insets.top + 12, 44);

  const loadData = async () => {
    try {
      const [alertasData, ocorrenciasData] = await Promise.all([
        alertService.getAlertasAtivos(),
        incidentService.getPaged(1, 6),
      ]);
      setAlertas(alertasData);
      setRecentes(ocorrenciasData.items || []);
    } catch (error) {
      console.error('Erro ao carregar dados da Home:', error);
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

  if (loading) {
    return <Loader message="Carregando painel da Defesa Civil..." />;
  }

  const emAtendimentoCount = recentes.filter((o) => o.status !== 'Resolvida').length;
  const resolvidasCount = recentes.filter((o) => o.status === 'Resolvida').length;
  const firstName = user?.nome?.split(' ')[0] || 'Cidadão';

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.defesaOrange]}
            tintColor={Colors.defesaBlue}
          />
        }
      >
        {/* Header Limpo Defesa Civil */}
        <View style={[styles.header, { paddingTop: topPadding }]}>
          <View style={styles.headerTopRow}>
            <View style={styles.brandRow}>
              <View style={styles.shieldBadge}>
                <Image
                  source={require('../../../assets/icon.png')}
                  style={styles.logoImage}
                  resizeMode="cover"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.greeting} numberOfLines={1}>
                  Olá, {firstName}
                </Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={12} color={Colors.defesaOrange} />
                  <Text style={styles.subtitle} numberOfLines={1}>
                    {user?.bairro || 'São Paulo'} • Defesa Civil
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={logout}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Sair da conta"
            >
              <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card Flutuante de Resumo Operacional */}
        <View style={styles.summaryWrapper}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{recentes.length}</Text>
              <Text style={styles.summaryLabel}>Chamados</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: Colors.defesaOrange }]}>
                {emAtendimentoCount}
              </Text>
              <Text style={styles.summaryLabel}>Em vistoria</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: Colors.normal }]}>
                {resolvidasCount}
              </Text>
              <Text style={styles.summaryLabel}>Resolvidas</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {/* Ação Rápida */}
          <TouchableOpacity
            style={styles.quickActionCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('NewIncidentTab')}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="add" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.quickActionTitle}>Notificar risco no bairro</Text>
              <Text style={styles.quickActionSub}>
                Alagamento, bueiro obstruído ou queda de árvore
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.defesaOrange} />
          </TouchableOpacity>

          {/* Alertas da Defesa Civil (Carrossel Horizontal Limpo) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alertas ativos ({alertas.length})</Text>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Monitoramento</Text>
            </View>
          </View>

          {alertas.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.alertsScroll}
              decelerationRate="fast"
              snapToInterval={ALERT_CARD_WIDTH + 12}
            >
              {alertas.map((alerta) => (
                <AlertBanner
                  key={alerta.id}
                  alerta={alerta}
                  style={{ width: ALERT_CARD_WIDTH }}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyAlerts}>
              <Ionicons name="checkmark-circle" size={22} color={Colors.normal} />
              <Text style={styles.emptyAlertsText}>
                Sem alertas críticos para {user?.bairro || 'sua região'} no momento.
              </Text>
            </View>
          )}

          {/* Ocorrências Recentes */}
          <View style={[styles.sectionHeader, { marginTop: 22 }]}>
            <Text style={styles.sectionTitle}>Chamados recentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('IncidentsListTab')}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {recentes.length > 0 ? (
            recentes.map((item) => (
              <IncidentCard
                key={item.id}
                incident={item}
                onPress={() => navigation.navigate('IncidentDetail', { incident: item })}
              />
            ))
          ) : (
            <View style={styles.emptyFeed}>
              <Ionicons name="document-text-outline" size={34} color={Colors.textMuted} />
              <Text style={styles.noData}>Nenhum chamado registrado recentemente.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  header: {
    backgroundColor: Colors.defesaBlue,
    paddingHorizontal: 20,
    paddingBottom: 42,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  shieldBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    marginRight: 12,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#CBD5E1',
    marginLeft: 4,
  },
  logoutBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryWrapper: {
    paddingHorizontal: 18,
    marginTop: -26,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.defesaBlue,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  body: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.defesaOrangeLight,
    borderWidth: 1,
    borderColor: Colors.defesaOrangeBorder,
    borderRadius: 16,
    padding: 14,
    marginBottom: 22,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.defesaOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  quickActionSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.normal,
    marginRight: 5,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.normalDark,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.defesaOrange,
  },
  alertsScroll: {
    gap: 12,
    paddingRight: 4,
  },
  emptyAlerts: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyAlertsText: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginLeft: 10,
    flex: 1,
  },
  emptyFeed: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  noData: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 8,
  },
});

export default HomeScreen;
