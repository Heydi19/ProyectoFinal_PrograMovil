import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useTheme } from '../../Context/ThemeNavigator';
import { useAuth } from '../../Context/AuthContext';
import { useLanguage } from '../../Context/LanguageContext';

export default function HomeScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [activeTasks, setActiveTasks] = useState(0);
  const [studyHoursToday, setStudyHoursToday] = useState('0 h');
  const [nextExams, setNextExams] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ENCABEZADO Y AVATAR */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greetingLabel, { color: colors.textSecondary }]}>
              {t('welcome')} 👋
            </Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.fullName || user?.email || 'Estudiante'}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.avatarButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => navigation.navigate('profile')}
            activeOpacity={0.7}
          >
            <Ionicons name="person-circle" size={44} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* TARJETA PRINCIPAL: PLAN DE HOY */}
        <View style={[styles.bannerCard, { backgroundColor: '#1d6395' }]}>
          <View style={styles.bannerHeader}>
            <View style={styles.bannerTag}>
              <Ionicons name="sparkles" size={14} color="#FFE082" />
              <Text style={styles.bannerTagText}>{t('home_banner_tag')}</Text>
            </View>
            <Ionicons name="calendar-outline" size={22} color="#FFFFFF" />
          </View>

          <Text style={styles.bannerTitle}>{t('home_banner_title')}</Text>
          <Text style={styles.bannerSubtitle}>
            {activeTasks === 0 && nextExams === 0
              ? t('home_banner_subtitle_empty')
              : t('home_banner_subtitle', { tasks: activeTasks, exams: nextExams })}
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {t('home_progress_completed', { percent: progressPercentage })}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bannerButton}
            onPress={() => navigation.navigate('tasks')}
            activeOpacity={0.8}
          >
            <Text style={styles.bannerButtonText}>{t('home_view_pending')}</Text>
            <Ionicons name="arrow-forward" size={16} color="#1d6395" />
          </TouchableOpacity>
        </View>

        {/* SECCIÓN 1: RESUMEN ACADÉMICO */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('home_academic_summary')}
        </Text>

        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('tasks')}
            activeOpacity={0.7}
          >
            <View style={[styles.statIconBadge, { backgroundColor: '#2196F31A' }]}>
              <Ionicons name="checkbox-outline" size={22} color="#2196F3" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {activeTasks}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {t('home_active_tasks_label')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('tracker')}
            activeOpacity={0.7}
          >
            <View style={[styles.statIconBadge, { backgroundColor: '#4CAF501A' }]}>
              <Ionicons name="time-outline" size={22} color="#4CAF50" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {studyHoursToday}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {t('home_study_today_label')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('exams')}
            activeOpacity={0.7}
          >
            <View style={[styles.statIconBadge, { backgroundColor: '#E539351A' }]}>
              <Ionicons name="calendar-outline" size={22} color="#E53935" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {nextExams}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {t('home_next_exam_label')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* SECCIÓN 2: ACCESO RÁPIDO */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('home_quick_access')}
        </Text>

        <View style={styles.quickAccessGroup}>
          <TouchableOpacity
            style={[styles.quickAccessCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('tracker')}
            activeOpacity={0.7}
          >
            <View style={styles.quickAccessLeft}>
              <View style={[styles.quickIconBg, { backgroundColor: '#1d63951F' }]}>
                <Ionicons name="play-circle" size={22} color="#1d6395" />
              </View>
              <View>
                <Text style={[styles.quickAccessTitle, { color: colors.text }]}>
                  {t('home_start_timer')}
                </Text>
                <Text style={[styles.quickAccessSubtitle, { color: colors.textSecondary }]}>
                  {t('home_start_timer_subtitle')}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAccessCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('tasks')}
            activeOpacity={0.7}
          >
            <View style={styles.quickAccessLeft}>
              <View style={[styles.quickIconBg, { backgroundColor: '#4CAF501F' }]}>
                <Ionicons name="add-circle" size={22} color="#4CAF50" />
              </View>
              <View>
                <Text style={[styles.quickAccessTitle, { color: colors.text }]}>
                  {t('home_new_task')}
                </Text>
                <Text style={[styles.quickAccessSubtitle, { color: colors.textSecondary }]}>
                  {t('home_new_task_subtitle')}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAccessCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('exams')}
            activeOpacity={0.7}
          >
            <View style={styles.quickAccessLeft}>
              <View style={[styles.quickIconBg, { backgroundColor: '#FF98001F' }]}>
                <Ionicons name="journal-outline" size={22} color="#FF9800" />
              </View>
              <View>
                <Text style={[styles.quickAccessTitle, { color: colors.text }]}>
                  {t('home_view_exams')}
                </Text>
                <Text style={[styles.quickAccessSubtitle, { color: colors.textSecondary }]}>
                  {t('home_view_exams_subtitle')}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* FRASE MOTIVACIONAL DEL DÍA */}
        <View
          style={[
            styles.quoteCard,
            { backgroundColor: isDark ? '#2C2C2E' : '#F0F4F8', borderColor: colors.border },
          ]}
        >
          <Ionicons name="bulb-outline" size={22} color={colors.primary} />
          <Text style={[styles.quoteText, { color: colors.text }]}>
            "{t('home_quote')}"
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  greetingLabel: { fontSize: 14, fontWeight: '500' },
  userName: { fontSize: 24, fontWeight: 'bold' },
  avatarButton: { borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
  bannerCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 22,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bannerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  bannerTagText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  bannerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  bannerSubtitle: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, lineHeight: 18, marginBottom: 14 },
  progressContainer: { marginBottom: 16 },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: { height: '100%', backgroundColor: '#FFE082', borderRadius: 3 },
  progressText: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 11, fontWeight: '500', textAlign: 'right' },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  bannerButtonText: { color: '#1d6395', fontWeight: 'bold', fontSize: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  statIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 11, fontWeight: '500', marginTop: 2, textAlign: 'center' },
  quickAccessGroup: { gap: 10, marginBottom: 24 },
  quickAccessCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  quickAccessLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  quickIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAccessTitle: { fontSize: 15, fontWeight: '600' },
  quickAccessSubtitle: { fontSize: 12, marginTop: 2 },
  quoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  quoteText: { fontSize: 12, fontStyle: 'italic', flex: 1, lineHeight: 16 },
});