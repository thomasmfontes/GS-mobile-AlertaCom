import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TipoRisco, NivelSeveridade } from '../../types/incident';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { KeyboardAwareScrollView } from '../../components/KeyboardAwareScrollView';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useIncidentForm } from '../../hooks/useIncidentForm';
import { Colors } from '../../theme/Colors';

const TIPOS_RISCO: { label: string; value: TipoRisco; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Alagamento', value: 'Alagamento', icon: 'water-outline' },
  { label: 'Bueiro', value: 'BueiroObstruido', icon: 'funnel-outline' },
  { label: 'Árvore', value: 'QuedaArvore', icon: 'leaf-outline' },
  { label: 'Deslizamento', value: 'Deslizamento', icon: 'warning-outline' },
  { label: 'Via / Buraco', value: 'RachaduraVia', icon: 'construct-outline' },
];

const SEVERIDADES: { label: string; value: NivelSeveridade; color: string; bg: string }[] = [
  { label: 'Baixa', value: 'Baixa', color: Colors.normalDark, bg: Colors.normalLight },
  { label: 'Média', value: 'Media', color: Colors.warningDark, bg: Colors.warningLight },
  { label: 'Alta', value: 'Alta', color: Colors.alertDark, bg: Colors.alertLight },
  { label: 'Crítica', value: 'Critica', color: Colors.dangerDark, bg: Colors.dangerLight },
];

export const NewIncidentScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 14, 46);

  const { imageUri, pickFromGallery, takePhoto, clearImage } = useImagePicker();
  const form = useIncidentForm({
    fotoUri: imageUri,
    onSuccess: () => {
      clearImage();
      navigation.navigate('MyIncidentsTab');
    },
  });

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <Text style={styles.title}>Reportar ocorrência</Text>
        <Text style={styles.subtitle}>Envie um relato com foto e endereço à Defesa Civil</Text>
      </View>

      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent} extraScrollHeight={64}>
        <Text style={styles.sectionLabel}>Tipo de risco</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagScroll}
        >
          {TIPOS_RISCO.map((item) => {
            const selected = form.tipoRisco === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[styles.tag, selected && styles.tagSelected]}
                onPress={() => form.setTipoRisco(item.value)}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={item.icon}
                  size={15}
                  color={selected ? '#FFFFFF' : Colors.textBody}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.tagText, selected && styles.tagTextSelected]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionLabel}>Gravidade</Text>
        <View style={styles.severityRow}>
          {SEVERIDADES.map((item) => {
            const selected = form.severidade === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.severityBtn,
                  selected && { borderColor: item.color, backgroundColor: item.bg },
                ]}
                onPress={() => form.setSeveridade(item.value)}
                activeOpacity={0.75}
              >
                <Text style={[styles.severityBtnText, selected && { color: item.color }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.formCard}>
          <CustomInput
            label="Título *"
            placeholder="Ex: Alagamento na avenida"
            value={form.titulo}
            onChangeText={form.setTitulo}
            error={form.errors.titulo}
          />

          <CustomInput
            label="Descrição *"
            placeholder="Descreva a situação e pontos de referência"
            value={form.descricao}
            onChangeText={form.setDescricao}
            error={form.errors.descricao}
            multiline
            numberOfLines={4}
          />

          <CustomInput
            label="Endereço *"
            icon="location-outline"
            placeholder="Ex: Av. Anhaia Mello, 1500"
            value={form.endereco}
            onChangeText={form.setEndereco}
            error={form.errors.endereco}
          />

          <CustomInput
            label="Bairro *"
            icon="business-outline"
            placeholder="Ex: Vila Prudente"
            value={form.bairro}
            onChangeText={form.setBairro}
            error={form.errors.bairro}
            containerStyle={{ marginBottom: 0 }}
          />
        </View>

        <Text style={styles.sectionLabel}>Foto do local (opcional)</Text>
        {imageUri ? (
          <View style={styles.photoPreviewWrapper}>
            <Image source={{ uri: imageUri }} style={styles.photoPreview} />
            <TouchableOpacity style={styles.removePhoto} onPress={clearImage}>
              <Ionicons name="close-circle" size={26} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoButtonsRow}>
            <TouchableOpacity style={styles.photoButton} onPress={takePhoto} activeOpacity={0.75}>
              <View style={[styles.photoIconBox, { backgroundColor: Colors.defesaOrangeLight }]}>
                <Ionicons name="camera-outline" size={20} color={Colors.defesaOrange} />
              </View>
              <Text style={styles.photoButtonText}>Câmera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.photoButton} onPress={pickFromGallery} activeOpacity={0.75}>
              <View style={[styles.photoIconBox, { backgroundColor: Colors.defesaBlueLight }]}>
                <Ionicons name="images-outline" size={20} color={Colors.defesaBlue} />
              </View>
              <Text style={styles.photoButtonText}>Galeria</Text>
            </TouchableOpacity>
          </View>
        )}

        <CustomButton
          title="Enviar relato"
          onPress={form.submit}
          loading={form.loading}
          style={{ marginTop: 18 }}
        />
      </KeyboardAwareScrollView>
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
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  sectionLabel: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 8,
  },
  tagScroll: {
    paddingBottom: 4,
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagSelected: {
    backgroundColor: Colors.defesaBlue,
    borderColor: Colors.defesaBlue,
  },
  tagText: {
    color: Colors.textBody,
    fontSize: 13,
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  severityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  severityBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 10,
  },
  severityBtnText: {
    color: Colors.textBody,
    fontSize: 12,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 6,
  },
  photoButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 14,
    height: 58,
    gap: 10,
  },
  photoIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  photoPreviewWrapper: {
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  photoPreview: {
    width: '100%',
    height: 180,
  },
  removePhoto: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.white,
    borderRadius: 14,
  },
});

export default NewIncidentScreen;
