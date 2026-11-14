import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ocorrencia } from '../types/incident';
import { SeverityBadge, StatusBadge } from './SeverityBadge';
import { Colors } from '../theme/Colors';
import { resolveImageUrl } from '../services/api';

interface IncidentCardProps {
  incident: Ocorrencia;
  onPress: () => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onPress }) => {
  const imageUri = resolveImageUrl(incident.fotoUrl);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <SeverityBadge severidade={incident.severidade} />
          <View style={{ width: 6 }} />
          <StatusBadge status={incident.status} />
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
      </View>

      <View style={styles.mainRow}>
        <View style={styles.textCol}>
          <Text style={styles.title} numberOfLines={2}>
            {incident.titulo}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {incident.descricao}
          </Text>
        </View>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.thumb} resizeMode="cover" />
        ) : null}
      </View>

      <View style={styles.footer}>
        <Ionicons name="location-outline" size={14} color={Colors.defesaOrange} />
        <Text style={styles.locationText} numberOfLines={1}>
          {incident.bairro} — {incident.endereco}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 10,
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
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 20,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: Colors.borderLight,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  locationText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
    flex: 1,
  },
});

export default IncidentCard;
