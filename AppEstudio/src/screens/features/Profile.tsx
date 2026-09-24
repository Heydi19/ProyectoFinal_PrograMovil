import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import * as ImagePicker from 'expo-image-picker';

import { supabase } from '../../lib/supabase';
import { useTheme } from '../../Context/ThemeNavigator';

export default function ProfileScreen({ navigation }: any) {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [gender, setGender] = useState('No especificado');

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Estado del modal de cambiar contraseña
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const user = session.user;
        setUserEmail(user.email || '');

        const meta = user.user_metadata || {};
        if (meta.avatar_url) setProfileImage(meta.avatar_url);

        if (meta.full_name) setFullName(meta.full_name);
        else setFullName(user.email?.split('@')[0] ?? 'Estudiante');

        if (meta.username) setUsername(meta.username);
        else setUsername(user.email?.split('@')[0] ?? 'usuario');

        if (meta.university) setUniversity(meta.university);
        if (meta.career) setDegree(meta.career);
        if (meta.gender) setGender(meta.gender);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfileData = async () => {
    try {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Alert.alert('Error', 'Sesión expirada. Por favor, vuelve a iniciar sesión.');
        return;
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          username: username,
          university: university,
          career: degree,
          gender: gender,
        },
      });

      if (error) throw error;

      Alert.alert('¡Éxito!', 'Perfil actualizado correctamente.');
      setIsEditModalVisible(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron guardar los cambios.');
    } finally {
      setLoading(false);
    }
  };

  const pickAndUploadImage = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        Alert.alert('Error', 'No hay una sesión activa.');
        return;
      }

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permiso requerido', 'Se requiere acceso a la galería para cambiar la foto.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled || !result.assets[0].uri) return;

      setUploading(true);
      const image = result.assets[0];
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const fileExt = image.uri.split('.').pop()?.toLowerCase() || 'jpeg';
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const publicUrl = publicUrlData.publicUrl;

      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      setProfileImage(publicUrl);
      Alert.alert('¡Éxito!', 'Foto de perfil actualizada.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Contraseña muy corta', 'Debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('No coinciden', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      Alert.alert('¡Listo!', 'Contraseña actualizada.');
      setIsPasswordModalVisible(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      Alert.alert('Error', error.message ?? 'No se pudo actualizar la contraseña.');
    }
  };

  const handleLogout = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
        },
      },
    ]);
  };

  if (loading && !isEditModalVisible) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Encabezado Principal */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.avatarContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={pickAndUploadImage}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={55} color={colors.primary} />
            )}

            <View style={[styles.activeBadge, { backgroundColor: '#4CAF50' }]} />

            <View style={[styles.cameraBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={12} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={[styles.userName, { color: colors.text }]}>{fullName}</Text>
          <Text style={[styles.userHandle, { color: colors.textSecondary }]}>@{username}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{userEmail}</Text>

          <TouchableOpacity
            style={[styles.tag, { backgroundColor: '#20629122' }]}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Text style={styles.tagText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Sección 1: Información Académica */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Información Académica</Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={22} color={colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Universidad</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{university || 'No especificada'}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Ionicons name="book-outline" size={22} color={colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Carrera</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{degree || 'No especificada'}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Ionicons name="transgender-outline" size={22} color={colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Género</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{gender}</Text>
            </View>
          </View>
        </View>

        {/* Bloques de Estadísticas Rápidas */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>4</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Materias</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>12 h</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Semana actual</Text>
          </View>
        </View>

        {/* Sección 2: Opciones de Cuenta */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Opciones de Cuenta</Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.optionRow} onPress={() => setIsPasswordModalVisible(true)}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.text} />
            <Text style={[styles.optionText, { color: colors.text }]}>Cambiar contraseña</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="color-palette-outline" size={20} color={colors.text} />
            <Text style={[styles.optionText, { color: colors.text }]}>Preferencia de Tema</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ffffff" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* MODAL: EDITAR PERFIL */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Editar Perfil</Text>

            <ScrollView style={{ width: '100%' }}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nombre completo</Text>
              <TextInput
                style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nombre completo"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nombre de usuario</Text>
              <TextInput
                style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                value={username}
                onChangeText={setUsername}
                placeholder="Nombre de usuario"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Universidad</Text>
              <TextInput
                style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                value={university}
                onChangeText={setUniversity}
                placeholder="Universidad"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Carrera</Text>
              <TextInput
                style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                value={degree}
                onChangeText={setDegree}
                placeholder="Carrera"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Género</Text>
              <TextInput
                style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                value={gender}
                onChangeText={setGender}
                placeholder="Género"
                placeholderTextColor={colors.textSecondary}
              />
            </ScrollView>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#888' }]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={saveProfileData}
              >
                <Text style={styles.modalBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: CAMBIAR CONTRASEÑA */}
      <Modal visible={isPasswordModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Cambiar Contraseña</Text>

            <TextInput
              style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nueva contraseña"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
            <TextInput
              style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirmar contraseña"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#888' }]}
                onPress={() => {
                  setIsPasswordModalVisible(false);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleChangePassword}
              >
                <Text style={styles.modalBtnText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16 },
  header: { alignItems: 'center', marginVertical: 12 },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 50 },
  activeBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: 'absolute',
    bottom: 2,
    right: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  cameraBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 5,
    borderRadius: 12,
  },
  userName: { fontSize: 22, fontWeight: 'bold' },
  userHandle: { fontSize: 13, marginTop: 1 },
  userEmail: { fontSize: 13, marginTop: 2 },
  tag: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 12, marginTop: 8 },
  tagText: { color: '#206291', fontWeight: '600', fontSize: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 18, marginBottom: 10 },
  card: { borderRadius: 12, padding: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  infoTextContainer: { marginLeft: 12, flex: 1 },
  infoLabel: { fontSize: 12 },
  infoValue: { fontSize: 15, fontWeight: '600', marginTop: 1 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  statBox: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { fontSize: 12, marginTop: 2 },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 10 },
  optionText: { flex: 1, fontSize: 15, fontWeight: '500' },
  divider: { height: 1, marginVertical: 8 },
  logoutButton: {
    backgroundColor: '#d32f2f',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginTop: 24,
    marginBottom: 16,
    gap: 8,
  },
  logoutText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 14 },
  inputLabel: { fontSize: 12, alignSelf: 'flex-start', marginTop: 10, marginBottom: 4 },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    width: '100%',
    marginBottom: 12,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnText: { color: '#FFF', fontWeight: 'bold' },
});