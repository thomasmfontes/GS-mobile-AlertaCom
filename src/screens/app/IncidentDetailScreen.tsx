import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppStackParamList } from '../../types/navigation';
import { SeverityBadge, StatusBadge } from '../../components/SeverityBadge';
import { CustomButton } from '../../components/CustomButton';
import { incidentService } from '../../services/incidentService';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { StatusOcorrencia, TipoRisco } from '../../types/incident';
import { resolveImageUrl } from '../../services/api';
import { Colors } from '../../theme/Colors';

type DetailRouteProp = RouteProp<AppStackParamList, 'IncidentDetail'>;

const TIPO_RISCO_LABEL: Record<TipoRisco, string> = {
  Alagamento: 'Alagamento / Enchente',
  BueiroObstruido: 'Bueiro Obstruído',
  QuedaArvore: 'Queda de Árvore',
  Deslizamento: 'Risco de Deslizamento',
  RachaduraVia: 'Rachadura / Buraco na Via',
  Outro: 'Outro Risco Urbano',
};

function getStepIndex(status: StatusOcorrencia | string): number {
  if (status === 'Resolvida') return 2;
  if (status === 'EmAtendimento') return 1;
  return 0;
}

export const IncidentDetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { notify } = useNotifications();

  const [incident, setIncident] = useState(route.params.incident);
  const [loadingAction, setLoadingAction] = useState(false);

  const canDelete =
    user?.id === incident.userId || user?.role === 'DefesaCivil' || user?.role === 'Admin';
  const isDefesaCivil = user?.role === 'DefesaCivil' || user?.role === 'Admin';
  const activeStep = getStepIndex(incident.status);
  const imageUri = resolveImageUrl(incident.fotoUrl);
  const topPadding = Math.max(insets.top + 10, 42);

  const handleDelete = () => {
    Alert.alert('Cancelar ocorrência', 'Tem certeza que deseja cancelar este chamado?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim, cancelar',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoadingAction(true);
            await incidentService.delete(incident.id);
            Alert.alert('Sucesso', 'Ocorrência cancelada.', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          } catch {
            Alert.alert('Erro', 'Não foi possível cancelar o chamado.');
          } finally {
            setLoadingAction(false);
          }
        },
      },
    ]);
  };

  const handleUpdateStatus = async (
    novoStatus: StatusOcorrencia,
    parecer: string,
    title: string,
    msg: string
  ) => {
    try {
      setLoadingAction(true);
      const updated = await incidentService.updateStatus(incident.id, novoStatus, parecer);
      setIncident(updated);
      await notify(title, `${updated.protocolo}: ${msg}`);
      Alert.alert(title, msg);
    } catch {
      Alert.alert('Erro', 'Falha ao atualizar status.');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header integrado à própria tela para transição 100% sincronizada */}
      <View style={[styles.topBar, { paddingTop: topPadding }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={21} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Detalhes da Ocorrência</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 24, 32) }}
        showsVerticalScrollIndicator={false}
      >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.heroImage} resizeMode="cover" />
      ) : null}

      <View style={[styles.sheet, imageUri ? styles.sheetWithHero : styles.sheetPlain]}>
        {/* Badges e Protocolo */}
        <View style={styles.topRow}>
          <View style={styles.badgeGroup}>
            <SeverityBadge severidade={incident.severidade} />
            <StatusBadge status={incident.status} />
          </View>
          <Text style={styles.protocolo}>#{incident.protocolo}</Text>
        </View>

        <Text style={styles.title}>{incident.titulo}</Text>

        {/* Linha do Tempo do Atendimento */}
        {incident.status !== 'Cancelada' ? (
          <View style={styles.stepperCard}>
            {['Aberta', 'Em vistoria', 'Resolvida'].map((stepLabel, idx) => {
              const completed = idx <= activeStep;
              const isCurrent = idx === activeStep;
              const stepColor =
                activeStep === 2 ? Colors.normal : Colors.defesaOrange;

              return (
                <React.Fragment key={stepLabel}>
                  <View style={styles.stepItem}>
                    <View
                      style={[
                        styles.stepDot,
                        completed
                          ? { backgroundColor: stepColor, borderColor: stepColor }
                          : styles.stepDotPending,
                      ]}
                    >
                      {completed ? (
                        <Ionicons
                          name={idx < activeStep || activeStep === 2 ? 'checkmark' : 'ellipse'}
                          size={idx < activeStep || activeStep === 2 ? 12 : 6}
                          color="#FFFFFF"
                        />
                      ) : null}
                    </View>
                    <Text
                      style={[
                        styles.stepLabel,
                        isCurrent && { color: Colors.textPrimary, fontWeight: '700' },
                      ]}
                    >
                      {stepLabel}
                    </Text>
                  </View>
                  {idx < 2 ? (
                    <View
                      style={[
                        styles.stepLine,
                        idx < activeStep && { backgroundColor: stepColor },
                      ]}
                    />
                  ) : null}
                </React.Fragment>
              );
            })}
          </View>
        ) : null}

        {/* Bloco Estruturado de Metadados */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, { backgroundColor: Colors.defesaOrangeLight }]}>
              <Ionicons name="location" size={16} color={Colors.defesaOrange} />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Localização</Text>
              <Text style={styles.infoValue}>{incident.endereco}</Text>
              <Text style={styles.infoSubValue}>{incident.bairro}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, { backgroundColor: Colors.defesaBlueLight }]}>
              <Ionicons name="calendar-outline" size={16} color={Colors.defesaBlue} />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Registrado em</Text>
              <Text style={styles.infoValue}>
                {new Date(incident.dataCriacao).toLocaleDateString('pt-BR')} às{' '}
                {new Date(incident.dataCriacao).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="alert-circle-outline" size={16} color={Colors.textBody} />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Categoria do risco</Text>
              <Text style={styles.infoValue}>
                {TIPO_RISCO_LABEL[incident.tipoRisco] || incident.tipoRisco}
              </Text>
            </View>
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Relato do cidadão</Text>
          <Text style={styles.description}>{incident.descricao}</Text>
        </View>

        {/* Parecer da Defesa Civil */}
        {incident.parecerTecnico ? (
          <View style={[styles.card, styles.parecerCard]}>
            <View style={styles.parecerHeader}>
              <Ionicons name="shield-checkmark" size={17} color={Colors.defesaBlue} />
              <Text style={styles.parecerTitle}>Parecer da Defesa Civil</Text>
            </View>
            <Text style={styles.parecerText}>{incident.parecerTecnico}</Text>
          </View>
        ) : (
          <View style={[styles.card, styles.waitingCard]}>
            <Ionicons name="time-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.waitingText}>
              Aguardando análise e despacho da equipe da Defesa Civil.
            </Text>
          </View>
        )}

        {/* Ações */}
        <View style={styles.actions}>
          {isDefesaCivil &&
            (incident.status === 'Aberta' || incident.status === 'EmAnalise') && (
              <CustomButton
                title="Iniciar vistoria"
                onPress={() =>
                  handleUpdateStatus(
                    'EmAtendimento',
                    'Equipe da Defesa Civil deslocada para vistoria técnica em campo.',
                    '🛡️ Vistoria iniciada',
                    'Chamado alterado para Em vistoria.'
                  )
                }
                loading={loadingAction}
                variant="primary"
              />
            )}

          {isDefesaCivil &&
            incident.status !== 'Resolvida' &&
            incident.status !== 'Cancelada' && (
              <CustomButton
                title="Concluir vistoria (Resolver)"
                onPress={() =>
                  handleUpdateStatus(
                    'Resolvida',
                    'Vistoria técnica concluída pela equipe de campo da Defesa Civil. Área desobstruída e liberada.',
                    '✅ Ocorrência resolvida',
                    'Chamado marcado como resolvido.'
                  )
                }
                loading={loadingAction}
                variant="secondary"
              />
            )}

          {canDelete && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleDelete}
              disabled={loadingAction}
              activeOpacity={0.75}
            >
              <Ionicons name="trash-outline" size={17} color={Colors.danger} />
              <Text style={styles.cancelBtnText}>Cancelar chamado</Text>
            </TouchableOpacity>
          )}
        </View>
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
  topBar: {
    backgroundColor: Colors.defesaBlue,
    paddingHorizontal: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 230,
    backgroundColor: Colors.borderLight,
  },
  sheet: {
    backgroundColor: Colors.background,
    paddingHorizontal: 18,
  },
  sheetWithHero: {
    marginTop: -22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
  },
  sheetPlain: {
    paddingTop: 18,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  protocolo: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 27,
    marginBottom: 16,
  },
  stepperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  stepItem: {
    alignItems: 'center',
    gap: 6,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotPending: {
    backgroundColor: Colors.white,
    borderColor: Colors.border,
  },
  stepLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 6,
    marginBottom: 18,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: 1,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  infoSubValue: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 10,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  description: {
    color: Colors.textBody,
    fontSize: 14,
    lineHeight: 22,
  },
  parecerCard: {
    backgroundColor: Colors.defesaBlueLight,
    borderColor: Colors.defesaBlueBorder,
  },
  parecerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  parecerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.defesaBlue,
    marginLeft: 6,
  },
  parecerText: {
    color: Colors.defesaBlue,
    fontSize: 14,
    lineHeight: 21,
  },
  waitingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  waitingText: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  actions: {
    marginTop: 6,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
    backgroundColor: Colors.dangerLight,
    marginTop: 6,
    gap: 8,
  },
  cancelBtnText: {
    color: Colors.dangerDark,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default IncidentDetailScreen;
