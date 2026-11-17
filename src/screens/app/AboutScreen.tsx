import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { APP_INFO } from '../../config/appInfo';
import { useAuth } from '../../hooks/useAuth';
import { Colors } from '../../theme/Colors';

export const AboutScreen: React.FC = () => {
  const { logout, user } = useAuth();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 16, 48);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Institucional Azul Marinho */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.logoFrame}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.appName}>{APP_INFO.name}</Text>
        <Text style={styles.version}>Versão {APP_INFO.version} • Defesa Civil</Text>

        <View style={styles.hashPill}>
          <Ionicons name="git-commit-outline" size={14} color={Colors.defesaOrange} />
          <Text style={styles.hashText}>Commit {APP_INFO.commitHash}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* Card do Projeto e ODS */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconBox, { backgroundColor: Colors.defesaOrangeLight }]}>
              <Ionicons name="earth-outline" size={17} color={Colors.defesaOrange} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Global Solution 2026/2</Text>
              <Text style={styles.cardSub}>{APP_INFO.theme}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>ODS da ONU atendidos</Text>
          {APP_INFO.ods.map((ods, idx) => (
            <View key={idx} style={styles.odsRow}>
              <View style={[styles.miniIconBox, { backgroundColor: Colors.normalLight }]}>
                <Ionicons name="checkmark" size={12} color={Colors.normalDark} />
              </View>
              <Text style={styles.odsText}>{ods}</Text>
            </View>
          ))}
        </View>

        {/* Card da Equipe */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconBox, { backgroundColor: Colors.defesaBlueLight }]}>
              <Ionicons name="people-outline" size={17} color={Colors.defesaBlue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Equipe do projeto</Text>
              <Text style={styles.cardSub}>Análise e Desenvolvimento de Sistemas • FIAP</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {APP_INFO.team.map((member, idx) => (
            <React.Fragment key={member.rm}>
              <View style={styles.memberRow}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.avatarInitial}>{member.name[0]}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
                <View style={styles.rmBadge}>
                  <Text style={styles.rmText}>{member.rm}</Text>
                </View>
              </View>
              {idx < APP_INFO.team.length - 1 ? <View style={styles.rowDivider} /> : null}
            </React.Fragment>
          ))}
        </View>

        {/* Card da Sessão */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Sessão autenticada</Text>

          <View style={styles.infoRow}>
            <View style={[styles.miniIconBox, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="person-outline" size={14} color={Colors.textBody} />
            </View>
            <Text style={styles.infoLabel}>Usuário</Text>
            <Text style={styles.infoValue}>{user?.nome || 'Cidadão'}</Text>
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.infoRow}>
            <View style={[styles.miniIconBox, { backgroundColor: Colors.defesaOrangeLight }]}>
              <Ionicons name="shield-outline" size={14} color={Colors.defesaOrange} />
            </View>
            <Text style={styles.infoLabel}>Perfil</Text>
            <Text style={[styles.infoValue, { color: Colors.defesaOrange }]}>{user?.role}</Text>
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.infoRow}>
            <View style={[styles.miniIconBox, { backgroundColor: Colors.defesaBlueLight }]}>
              <Ionicons name="location-outline" size={14} color={Colors.defesaBlue} />
            </View>
            <Text style={styles.infoLabel}>Bairro</Text>
            <Text style={styles.infoValue}>{user?.bairro || 'São Paulo'}</Text>
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={logout}
            activeOpacity={0.75}
          >
            <Ionicons name="log-out-outline" size={17} color={Colors.danger} />
            <Text style={styles.logoutBtnText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.defesaBlue,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logoFrame: {
    width: 76,
    height: 76,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  version: {
    fontSize: 13,
    color: '#CBD5E1',
    marginTop: 2,
  },
  hashPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginTop: 10,
    gap: 6,
  },
  hashText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  miniIconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 12,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 8,
  },
  odsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  odsText: {
    color: Colors.textBody,
    fontSize: 13,
    flex: 1,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.defesaBlueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: Colors.defesaBlue,
    fontWeight: '700',
    fontSize: 15,
  },
  memberName: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  memberRole: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  rmBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rmText: {
    color: Colors.textBody,
    fontSize: 11,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
    backgroundColor: Colors.dangerLight,
    marginTop: 14,
    gap: 8,
  },
  logoutBtnText: {
    color: Colors.dangerDark,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default AboutScreen;
