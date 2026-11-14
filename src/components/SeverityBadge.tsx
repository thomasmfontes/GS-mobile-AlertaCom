import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NivelSeveridade, StatusOcorrencia } from '../types/incident';
import { Colors } from '../theme/Colors';

interface SeverityBadgeProps {
  severidade: NivelSeveridade | string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severidade }) => {
  const getConfig = () => {
    switch (severidade) {
      case 'Critica':
        return { bg: Colors.dangerLight, text: Colors.dangerDark, dot: Colors.danger, label: 'Emergência' };
      case 'Alta':
        return { bg: Colors.alertLight, text: Colors.alertDark, dot: Colors.alert, label: 'Alerta' };
      case 'Media':
        return { bg: Colors.warningLight, text: Colors.warningDark, dot: Colors.warning, label: 'Atenção' };
      case 'Baixa':
      default:
        return { bg: Colors.normalLight, text: Colors.normalDark, dot: Colors.normal, label: 'Vigilância' };
    }
  };

  const { bg, text, dot, label } = getConfig();

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <Text style={[styles.badgeText, { color: text }]}>{label}</Text>
    </View>
  );
};

interface StatusBadgeProps {
  status: StatusOcorrencia | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getConfig = () => {
    switch (status) {
      case 'Resolvida':
        return { bg: Colors.normalLight, text: Colors.normalDark, label: 'Resolvida' };
      case 'EmAtendimento':
        return { bg: Colors.defesaBlueLight, text: Colors.defesaBlue, label: 'Em vistoria' };
      case 'EmAnalise':
        return { bg: Colors.warningLight, text: Colors.warningDark, label: 'Em análise' };
      case 'Cancelada':
        return { bg: '#F1F5F9', text: '#475569', label: 'Arquivada' };
      case 'Aberta':
      default:
        return { bg: '#F1F5F9', text: Colors.textBody, label: 'Aberta' };
    }
  };

  const { bg, text, label } = getConfig();

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default SeverityBadge;
