import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AlertaClimatico } from '../types/incident';
import { Colors } from '../theme/Colors';

interface AlertBannerProps {
  alerta: AlertaClimatico;
  style?: ViewStyle;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerta, style }) => {
  const isCritico = alerta.nivel === 'Critica';
  const isAlto = alerta.nivel === 'Alta';

  const accentColor = isCritico
    ? Colors.danger
    : isAlto
    ? Colors.defesaOrange
    : Colors.warning;

  const pillBg = isCritico
    ? Colors.dangerLight
    : isAlto
    ? Colors.defesaOrangeLight
    : Colors.warningLight;

  const label = isCritico
    ? 'Alerta máximo'
    : isAlto
    ? 'Alerta laranja'
    : 'Atenção';

  return (
    <View style={[styles.card, { borderLeftColor: accentColor }, style]}>
      <View style={styles.topRow}>
        <View style={[styles.levelPill, { backgroundColor: pillBg }]}>
          <Ionicons
            name={isCritico ? 'warning' : 'thunderstorm'}
            size={12}
            color={accentColor}
          />
          <Text style={[styles.levelText, { color: accentColor }]}>{label}</Text>
        </View>
        <Text style={styles.regionText} numberOfLines={1}>
          {alerta.bairro}
        </Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {alerta.titulo}
      </Text>
      <Text style={styles.message} numberOfLines={2}>
        {alerta.mensagem}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  regionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 8,
    flexShrink: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: Colors.textBody,
    lineHeight: 18,
  },
});

export default AlertBanner;
