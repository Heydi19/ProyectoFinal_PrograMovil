import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/build/Ionicons';

import { supabase } from '../../lib/supabase';
import { useTheme } from '../../Context/ThemeNavigator';
import { useLanguage } from '../../Context/LanguageContext';

export default function SettingsScreen({ navigation }: any) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { locale, setLanguage, t } = useLanguage();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [examReminders, setExamReminders] = useState(true);

  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const handleLogout = async () => {
    Alert.alert(t('logout'), t('settings_logout_confirm_message'), [
      { text: t('settings_logout_cancel'), style: 'cancel' },
      {
        text: t('settings_logout_confirm'),
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
        },
      },
    ]);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert(t('change_password_short_title'), t('change_password_short'));
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t('change_password_mismatch_title'), t('change_password_mismatch'));
      return;
    }

    try {
      setSavingPassword(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      Alert.alert(t('change_password_success_title'), t('change_password_success'));
      setIsPasswordModalVisible(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      Alert.alert(t('generic_error_title'), error.message ?? t('change_password_generic_error'));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings')}</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {t('settings_subtitle')}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings_appearance_section')}</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '18' }]}>
                <Ionicons name={isDark ? "moon" : "sunny"} size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.optionTitle, { color: colors.text }]}>{t('dark_mode')}</Text>
                <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                  {isDark ? t('settings_theme_dark_active') : t('settings_theme_light_active')}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D1D6', true: colors.primary + '80' }}
              thumbColor={isDark ? colors.primary : '#FFFFFF'}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings_language_section')}</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '18' }]}>
                <Ionicons name="language-outline" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.optionTitle, { color: colors.text }]}>
                {locale === 'es' ? t('language_spanish') : t('language_english')}
              </Text>
            </View>

            <View style={styles.languageToggle}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  { borderColor: colors.border },
                  locale === 'es' && { backgroundColor: colors.primary },
                ]}
                onPress={() => setLanguage('es')}
              >
                <Text style={[styles.languageButtonText, { color: locale === 'es' ? '#fff' : colors.text }]}>ES</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  { borderColor: colors.border },
                  locale === 'en' && { backgroundColor: colors.primary },
                ]}
                onPress={() => setLanguage('en')}
              >
                <Text style={[styles.languageButtonText, { color: locale === 'en' ? '#fff' : colors.text }]}>EN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings_notifications_section')}</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#4CAF5018' }]}>
                <Ionicons name="notifications-outline" size={20} color="#4CAF50" />
              </View>
              <View>
                <Text style={[styles.optionTitle, { color: colors.text }]}>{t('settings_task_reminders_title')}</Text>
                <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                  {t('settings_task_reminders_subtitle')}
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D1D6', true: '#4CAF5080' }}
              thumbColor={notificationsEnabled ? '#4CAF50' : '#FFFFFF'}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FF980018' }]}>
                <Ionicons name="calendar-outline" size={20} color="#FF9800" />
              </View>
              <View>
                <Text style={[styles.optionTitle, { color: colors.text }]}>{t('settings_exam_alerts_title')}</Text>
                <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                  {t('settings_exam_alerts_subtitle')}
                </Text>
              </View>
            </View>
            <Switch
              value={examReminders}
              onValueChange={setExamReminders}
              trackColor={{ false: '#D1D1D6', true: '#FF980080' }}
              thumbColor={examReminders ? '#FF9800' : '#FFFFFF'}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings_account_section')}</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => navigation.navigate('profile')}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '18' }]}>
                <Ionicons name="person-outline" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.optionTitle, { color: colors.text }]}>{t('settings_edit_profile')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setIsPasswordModalVisible(true)}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '18' }]}>
                <Ionicons name="key-outline" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.optionTitle, { color: colors.text }]}>{t('settings_change_password')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings_info_section')}</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#9C27B018' }]}>
                <Ionicons name="help-circle-outline" size={20} color="#9C27B0" />
              </View>
              <Text style={[styles.optionTitle, { color: colors.text }]}>{t('settings_help_support')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#607D8B18' }]}>
                <Ionicons name="information-circle-outline" size={20} color="#607D8B" />
              </View>
              <View>
                <Text style={[styles.optionTitle, { color: colors.text }]}>{t('settings_app_version')}</Text>
                <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>v1.0.0</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal visible={isPasswordModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('settings_password_modal_title')}</Text>

            <TextInput
              style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder={t('settings_new_password_placeholder')}
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
            <TextInput
              style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t('settings_confirm_password_placeholder')}
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
                <Text style={styles.modalBtnText}>{t('settings_logout_cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleChangePassword}
                disabled={savingPassword}
              >
                <Text style={styles.modalBtnText}>
                  {savingPassword ? t('settings_password_saving') : t('settings_password_update')}
                </Text>
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
  scrollContent: { padding: 16, paddingBottom: 32 },
  header: { marginTop: 8, marginBottom: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 13, marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginTop: 16, marginBottom: 8, marginLeft: 4 },
  card: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconContainer: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  optionTitle: { fontSize: 15, fontWeight: '500' },
  optionSubtitle: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginVertical: 4 },
  languageToggle: { flexDirection: 'row', gap: 6 },
  languageButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  languageButtonText: { fontSize: 13, fontWeight: '600' },
  logoutButton: {
    backgroundColor: '#d32f2f',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 28,
    gap: 8,
  },
  logoutText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { borderRadius: 16, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 14 },
  modalInput: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 14, width: '100%', marginBottom: 12 },
  modalButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 8, gap: 10 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  modalBtnText: { color: '#FFF', fontWeight: 'bold' },
});