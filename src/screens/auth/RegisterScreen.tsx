import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { KeyboardAwareScrollView } from '../../components/KeyboardAwareScrollView';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import { Colors } from '../../theme/Colors';

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const form = useRegisterForm();
  const topPadding = Math.max(insets.top + 14, 44);

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: topPadding }]}>
        <TouchableOpacity
          style={styles.backIconBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Cadastro cidadão no AlertaCom</Text>
        </View>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        extraScrollHeight={64}
        basePaddingBottom={Math.max(insets.bottom + 24, 32)}
      >
        {form.globalError ? <Text style={styles.errorBanner}>{form.globalError}</Text> : null}

        <View style={styles.card}>
          <CustomInput
            label="Nome completo *"
            icon="person-outline"
            placeholder="Ex: João da Silva"
            value={form.nome}
            onChangeText={form.setNome}
            error={form.errors.nome}
          />

          <CustomInput
            label="Usuário *"
            icon="at-outline"
            placeholder="Ex: joaosilva"
            value={form.username}
            onChangeText={form.setUsername}
            error={form.errors.username}
            autoCapitalize="none"
          />

          <CustomInput
            label="E-mail *"
            icon="mail-outline"
            placeholder="Ex: joao@email.com"
            keyboardType="email-address"
            value={form.email}
            onChangeText={form.setEmail}
            error={form.errors.email}
            autoCapitalize="none"
          />

          <CustomInput
            label="CPF *"
            icon="card-outline"
            placeholder="000.000.000-00"
            keyboardType="numeric"
            maxLength={14}
            value={form.cpf}
            onChangeText={form.setCpf}
            error={form.errors.cpf}
          />

          <CustomInput
            label="Bairro *"
            icon="location-outline"
            placeholder="Ex: Vila Prudente"
            value={form.bairro}
            onChangeText={form.setBairro}
            error={form.errors.bairro}
          />

          <CustomInput
            label="Telefone"
            icon="call-outline"
            placeholder="(11) 90000-0000"
            keyboardType="phone-pad"
            maxLength={15}
            value={form.telefone}
            onChangeText={form.setTelefone}
            error={form.errors.telefone}
          />

          <CustomInput
            label="Senha *"
            icon="lock-closed-outline"
            rightIcon={form.showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={form.toggleShowPassword}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry={!form.showPassword}
            value={form.password}
            onChangeText={form.setPassword}
            error={form.errors.password}
            containerStyle={{ marginBottom: 4 }}
          />

          <CustomButton
            title="Criar conta"
            onPress={form.submit}
            loading={form.loading}
            style={{ marginTop: 14 }}
          />
        </View>
      </KeyboardAwareScrollView>
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
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 13,
    color: '#CBD5E1',
    marginTop: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  errorBanner: {
    color: Colors.dangerDark,
    backgroundColor: Colors.dangerLight,
    padding: 10,
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 12,
  },
});

export default RegisterScreen;
