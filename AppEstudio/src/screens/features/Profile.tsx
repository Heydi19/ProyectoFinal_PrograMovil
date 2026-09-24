import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useTheme } from '../../Context/ThemeNavigator';
import { useAuth } from '../../Context/AuthContext';
import { useLanguage } from '../../Context/LanguageContext';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen({ navigation }: any) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  // Estados para Materias
  const [subjectCount, setSubjectCount] = useState<number>(0);
  const [tempSubjectCount, setTempSubjectCount] = useState<number>(0);
  const [isEditingSubjects, setIsEditingSubjects] = useState<boolean>(false);

  // Estados de Información Académica (Perfil)
  const [university, setUniversity] = useState<string>((user as any)?.university || 'Ceutec');
  const [career, setCareer] = useState<string>((user as any)?.career || 'Ingeniería en Informática');
  const [gender, setGender] = useState<string>(t('profile_gender_default'));

  // Estados para Modal de Editar Perfil
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [editUniversity, setEditUniversity] = useState(university);
  const [editCareer, setEditCareer] = useState(career);
  const [editGender, setEditGender] = useState(gender);

  // Estado para Modal de Tema
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);

  // Estados para Modal de Cambiar Contraseña
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleStartEditing = () => {
    setTempSubjectCount(subjectCount);
    setIsEditingSubjects(true);
  };

  const handleSaveSubjects = () => {
    setSubjectCount(tempSubjectCount);
    setIsEditingSubjects(false);
  };

  const handleCancelEditing = () => {
    setTempSubjectCount(subjectCount);
    setIsEditingSubjects(false);
  };

  const handleOpenProfileModal = () => {
    setEditUniversity(university);
    setEditCareer(career);
    setEditGender(gender);
    setIsProfileModalVisible(true);
  };

  const handleSaveProfile = () => {
    setUniversity(editUniversity.trim() || t('profile_university_default'));
    setCareer(editCareer.trim() || t('profile_career_default'));
    setGender(editGender.trim() || t('profile_gender_default'));
    setIsProfileModalVisible(false);
  };

  const handleChangePassword = async () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    Alert.alert(t('generic_error_title'), t('profile_password_error_empty'));
    return;
  }
  if (newPassword.length < 6) {
    Alert.alert(t('generic_error_title'), t('profile_password_error_short'));
    return;
  }
  if (newPassword !== confirmPassword) {
    Alert.alert(t('generic_error_title'), t('profile_password_error_mismatch'));
    return;
  }

  try {
    // Verifica que la contraseña actual sea correcta antes de cambiarla
    if (user?.email) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (signInError) {
        Alert.alert(t('generic_error_title'), t('profile_current_password_wrong'));
        return;
      }
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;

    Alert.alert(t('generic_success_title'), t('profile_password_success'));
    setIsPasswordModalVisible(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  } catch (error: any) {
    Alert.alert(t('generic_error_title'), error.message ?? t('change_password_generic_error'));
  }
};

 const handleLogout = () => {
  Alert.alert(t('profile_logout_button'), t('profile_logout_confirm_message'), [
    { text: t('profile_cancel'), style: 'cancel' },
    {
      text: t('profile_logout_confirm'),
      style: 'destructive',
      onPress: async () => {
        await logout();
        navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
      },
    },
  ]);
};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* AVATAR Y DATOS DE USUARIO */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={54} color={colors.primary} />
            <TouchableOpacity style={styles.cameraBadge}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.fullName || t('profile_new_user_fallback')}
          </Text>
          <Text style={[styles.userHandle, { color: colors.textSecondary }]}>
            @{user?.email?.split('@')[0] || t('profile_username_fallback')}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user?.email || t('profile_email_fallback')}
          </Text>

          <TouchableOpacity style={styles.editProfileButton} onPress={handleOpenProfileModal}>
            <Text style={styles.editProfileText}>{t('profile_edit_button')}</Text>
          </TouchableOpacity>
        </View>

        {/* INFORMACIÓN ACADÉMICA */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile_academic_info_title')}</Text>

        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={20} color={colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('profile_university_label')}</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{university}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Ionicons name="book-outline" size={20} color={colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('profile_career_label')}</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{career}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Ionicons name="transgender-outline" size={20} color={colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('profile_gender_label')}</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{gender}</Text>
            </View>
          </View>
        </View>

        {/* SECTOR MATERIAS */}
        <View style={[styles.subjectCard, { backgroundColor: colors.surface }]}>
          <View style={styles.subjectHeaderRow}>
            <Text style={[styles.subjectCardTitle, { color: colors.textSecondary }]}>
              {t('profile_subjects_title')}
            </Text>

            {!isEditingSubjects && (
              <TouchableOpacity style={styles.actionIconButton} onPress={handleStartEditing}>
                <Ionicons name="create-outline" size={18} color={colors.primary} />
                <Text style={[styles.actionIconText, { color: colors.primary }]}>{t('profile_edit_link')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditingSubjects ? (
            <View style={styles.editModeContainer}>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  style={[styles.counterButton, { backgroundColor: colors.border }]}
                  onPress={() => setTempSubjectCount(prev => Math.max(0, prev - 1))}
                >
                  <Ionicons name="remove" size={20} color={colors.text} />
                </TouchableOpacity>

                <Text style={[styles.subjectCountText, { color: colors.text }]}>
                  {tempSubjectCount}
                </Text>

                <TouchableOpacity
                  style={[styles.counterButton, { backgroundColor: colors.primary }]}
                  onPress={() => setTempSubjectCount(prev => prev + 1)}
                >
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.confirmButtonsRow}>
                <TouchableOpacity
                  style={[styles.confirmBtn, styles.cancelBtn]}
                  onPress={handleCancelEditing}
                >
                  <Text style={styles.cancelBtnText}>{t('profile_cancel')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.confirmBtn, styles.saveBtn]}
                  onPress={handleSaveSubjects}
                >
                  <Text style={styles.saveBtnText}>{t('profile_accept')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.readModeContainer}>
              <Text style={[styles.displayCountText, { color: colors.text }]}>
                {subjectCount}
              </Text>
              <Text style={[styles.displaySubtext, { color: colors.textSecondary }]}>
                {subjectCount === 1 ? t('profile_subject_singular') : t('profile_subject_plural')}
              </Text>
            </View>
          )}
        </View>

        {/* OPCIONES DE CUENTA */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile_account_options_title')}</Text>

        <View style={[styles.optionsCard, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setIsPasswordModalVisible(true)}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>{t('profile_change_password_option')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setIsThemeModalVisible(true)}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="color-palette-outline" size={20} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>{t('profile_theme_preference_option')}</Text>
            </View>
            <View style={styles.themeBadgeContainer}>
              <Text style={[styles.themeBadgeText, { color: colors.textSecondary }]}>
                {isDark ? t('profile_theme_dark') : t('profile_theme_light')}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* CERRAR SESIÓN */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t('profile_logout_button')}</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* 1. MODAL EDITAR PERFIL */}
      <Modal
        visible={isProfileModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('profile_edit_modal_title')}</Text>

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('profile_university_label')}</Text>
            <TextInput
              style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              value={editUniversity}
              onChangeText={setEditUniversity}
              placeholder={t('profile_university_placeholder')}
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('profile_career_label')}</Text>
            <TextInput
              style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              value={editCareer}
              onChangeText={setEditCareer}
              placeholder={t('profile_career_placeholder')}
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('profile_gender_label')}</Text>
            <TextInput
              style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              value={editGender}
              onChangeText={setEditGender}
              placeholder={t('profile_gender_placeholder')}
              placeholderTextColor={colors.textSecondary}
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setIsProfileModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>{t('profile_cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSaveBtn]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.modalSaveText}>{t('profile_save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2. MODAL CAMBIAR CONTRASEÑA */}
      <Modal
        visible={isPasswordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('profile_change_password_title')}</Text>

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('profile_current_password_label')}</Text>
            <TextInput
              style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('profile_new_password_label')}</Text>
            <TextInput
              style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('profile_confirm_password_label')}</Text>
            <TextInput
              style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => {
                  setIsPasswordModalVisible(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                <Text style={styles.modalCancelText}>{t('profile_cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSaveBtn]}
                onPress={handleChangePassword}
              >
                <Text style={styles.modalSaveText}>{t('profile_update_button')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 3. MODAL PREFERENCIA DE TEMA */}
      <Modal
        visible={isThemeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsThemeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('profile_theme_modal_title')}</Text>

            <TouchableOpacity
              style={[
                styles.themeOptionRow,
                !isDark && { backgroundColor: colors.border + '33' },
              ]}
              onPress={() => {
                if (isDark) toggleTheme();
                setIsThemeModalVisible(false);
              }}
            >
              <View style={styles.themeOptionLeft}>
                <Ionicons name="sunny-outline" size={22} color="#FFB300" />
                <Text style={[styles.themeOptionText, { color: colors.text }]}>{t('profile_theme_light_option')}</Text>
              </View>
              {!isDark && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOptionRow,
                isDark && { backgroundColor: colors.border + '33' },
              ]}
              onPress={() => {
                if (!isDark) toggleTheme();
                setIsThemeModalVisible(false);
              }}
            >
              <View style={styles.themeOptionLeft}>
                <Ionicons name="moon-outline" size={22} color="#7E57C2" />
                <Text style={[styles.themeOptionText, { color: colors.text }]}>{t('profile_theme_dark_option')}</Text>
              </View>
              {isDark && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, styles.modalCancelBtn, { marginTop: 16 }]}
              onPress={() => setIsThemeModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>{t('profile_close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  cameraBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#1d6395',
    padding: 6,
    borderRadius: 12,
  },
  userName: { fontSize: 20, fontWeight: 'bold' },
  userHandle: { fontSize: 13, marginTop: 2 },
  userEmail: { fontSize: 12, marginTop: 1 },
  editProfileButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 10,
  },
  editProfileText: { fontSize: 12, fontWeight: '600', color: '#333333' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  infoCard: { borderRadius: 12, padding: 14, marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoTextContainer: { flex: 1 },
  infoLabel: { fontSize: 11 },
  infoValue: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  divider: { height: 1, marginVertical: 10 },
  subjectCard: { borderRadius: 12, padding: 16, marginBottom: 16 },
  subjectHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  subjectCardTitle: { fontSize: 13, fontWeight: '600' },
  actionIconButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionIconText: { fontSize: 13, fontWeight: '600' },
  readModeContainer: { alignItems: 'center', paddingVertical: 6 },
  displayCountText: { fontSize: 32, fontWeight: 'bold' },
  displaySubtext: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  editModeContainer: { alignItems: 'center', marginTop: 6 },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 24, marginBottom: 14 },
  counterButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  subjectCountText: { fontSize: 26, fontWeight: 'bold' },
  confirmButtonsRow: { flexDirection: 'row', gap: 12, width: '100%', justifyContent: 'center' },
  confirmBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8, minWidth: 100, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#E0E0E0' },
  cancelBtnText: { color: '#333333', fontWeight: '600', fontSize: 13 },
  saveBtn: { backgroundColor: '#1d6395' },
  saveBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  optionsCard: { borderRadius: 12, padding: 14, marginBottom: 24 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionText: { fontSize: 14, fontWeight: '500' },
  themeBadgeContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  themeBadgeText: { fontSize: 12, fontWeight: '500' },
  logoutButton: { backgroundColor: '#D32F2F', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  logoutText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', borderRadius: 16, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  modalInput: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 12 },
  modalActionsRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, alignItems: 'center' },
  modalCancelBtn: { backgroundColor: '#E0E0E0' },
  modalCancelText: { color: '#333333', fontWeight: '600' },
  modalSaveBtn: { backgroundColor: '#1d6395' },
  modalSaveText: { color: '#FFFFFF', fontWeight: '600' },
  themeOptionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 10, marginBottom: 8 },
  themeOptionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  themeOptionText: { fontSize: 15, fontWeight: '600' },
});