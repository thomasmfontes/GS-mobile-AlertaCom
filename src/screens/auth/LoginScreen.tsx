import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../hooks/useAuth';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { KeyboardAwareScrollView } from '../../components/KeyboardAwareScrollView';
import { Colors } from '../../theme/Colors';

type LoginNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [username, setUsername] = useState('cidadao');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const topPadding = Math.max(insets.top + 24, 52);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Informe usuário e senha para entrar.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(username.trim(), password);
    } catch (err: any) {
      let msg = 'Falha ao autenticar. Verifique usuário e senha.';
      if (err.response?.status === 401) {
        msg = 'Usuário ou senha incorretos.';
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message && err.message.toLowerCase().includes('network')) {
        msg = 'Não foi possível conectar à API na porta 5208.';
      }
      setError(msg);
      Alert.alert('Erro de acesso', msg);
    } finally {
      setLoading(false);
    }
  };

  const setFastLogin = (user: string) => {
    setUsername(user);
    setPassword('123456');
    setError('');
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding }]}
        extraScrollHeight={56}
        basePaddingBottom={Math.max(insets.bottom + 24, 32)}
      >
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.appName}>AlertaCom</Text>
          <Text style={styles.tagline}>Defesa Civil & Monitoramento Cidadão</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entrar na conta</Text>

          {error ? <Text style={styles.globalError}>{error}</Text> : null}

          <CustomInput
            label="Usuário"
            icon="person-outline"
            placeholder="Digite seu usuário"
            value={username}
            onChangeText={(t) => { setUsername(t); setError(''); }}
            autoCapitalize="none"
          />

          <CustomInput
            label="Senha"
            icon="lock-closed-outline"
            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPassword((prev) => !prev)}
            placeholder="Digite sua senha"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(t) => { setPassword(t); setError(''); }}
          />

          <CustomButton
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: 6 }}
          />

          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Acesso rápido para teste</Text>
            <View style={styles.demoRow}>
              {[
                { key: 'cidadao', label: 'Cidadão' },
                { key: 'defesacivil', label: 'Defesa Civil' },
                { key: 'admin', label: 'Gestor' },
              ].map((item) => {
                const active = username === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.demoChip, active && styles.demoChipActive]}
                    onPress={() => setFastLogin(item.key)}
                  >
                    <Text style={[styles.demoChipText, active && styles.demoChipTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Criar cadastro</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.defesaBlue,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoCircle: {
    width: 82,
    height: 82,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  tagline: {
    fontSize: 14,
    color: '#CBD5E1',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  globalError: {
    color: Colors.dangerDark,
    backgroundColor: Colors.dangerLight,
    padding: 10,
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 12,
  },
  demoSection: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoChip: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  demoChipActive: {
    backgroundColor: Colors.defesaOrangeLight,
    borderColor: Colors.defesaOrange,
  },
  demoChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textBody,
  },
  demoChipTextActive: {
    color: Colors.defesaOrangeDark,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  footerText: {
    color: '#CBD5E1',
    fontSize: 14,
  },
  registerLink: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LoginScreen;
