import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../Context/ThemeNavigator';
import { useLanguage } from '../../Context/LanguageContext';

interface StudySession {
  id: string;
  subject: string;
  minutes: number;
  date: string;
}

export default function StudyTrackerScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [subject, setSubject] = useState('');

  // Arreglo inicial vacío para nuevos usuarios
  const [sessions, setSessions] = useState<StudySession[]>([]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const startTimer = () => {
    if (!subject.trim() || isActive) return;
    setIsActive(true);
  };

  const pauseTimer = () => {
    if (!isActive) return;
    setIsActive(false);
  };

  const saveSession = () => {
    if (seconds === 0 || !subject.trim()) return;

    const newSession: StudySession = {
      id: Date.now().toString(),
      subject: subject.trim(),
      minutes: Math.max(1, Math.floor(seconds / 60)),
      date: 'Hoy', // valor interno, no se traduce (lo usa HomeScreen para calcular el total de hoy)
    };

    setSessions([newSession, ...sessions]);
    setSeconds(0);
    setIsActive(false);
    setSubject('');
  };

  const handleDeleteSession = (id: string) => {
    Alert.alert('Eliminar sesión', '¿Seguro que quieres eliminar esta sesión del historial?', [
      { text: t('tasks_cancel'), style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => setSessions((prev) => prev.filter((s) => s.id !== id)),
      },
    ]);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalMinutes = sessions.reduce((acc, curr) => acc + curr.minutes, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('tracker_title')}</Text>
      </View>

      {/* Tarjeta de Estadísticas de Progreso */}
      <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.statsTitle, { color: colors.textSecondary }]}>
          {t('tracker_total_time_label')}
        </Text>
        <Text style={[styles.statsValue, { color: colors.text }]}>
          {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
        </Text>
      </View>

      {/* Selector/Materia y Cronómetro */}
      <View style={[styles.timerContainer, { backgroundColor: colors.surface }]}>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholder={t('tracker_subject_placeholder')}
          placeholderTextColor={colors.textSecondary}
          value={subject}
          onChangeText={setSubject}
          editable={!isActive}
        />

        <Text style={[styles.timerText, { color: colors.text }]}>
          {formatTime(seconds)}
        </Text>

        <View style={styles.buttonRow}>
          {/* Iniciar */}
          <TouchableOpacity
            style={[
              styles.timerButton,
              { backgroundColor: '#206291' },
              (isActive || !subject.trim()) && styles.buttonDisabled,
            ]}
            onPress={startTimer}
            disabled={isActive || !subject.trim()}
          >
            <Text style={styles.buttonText}>{t('tracker_start')}</Text>
          </TouchableOpacity>

          {/* Pausar */}
          <TouchableOpacity
            style={[
              styles.timerButton,
              { backgroundColor: '#f57c00' },
              !isActive && styles.buttonDisabled,
            ]}
            onPress={pauseTimer}
            disabled={!isActive}
          >
            <Text style={styles.buttonText}>{t('tracker_pause')}</Text>
          </TouchableOpacity>

          {/* Guardar */}
          <TouchableOpacity
            style={[
              styles.timerButton,
              { backgroundColor: '#388e3c' },
              seconds === 0 && styles.buttonDisabled,
            ]}
            onPress={saveSession}
            disabled={seconds === 0}
          >
            <Text style={styles.buttonText}>{t('tracker_save')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Historial de Sesiones */}
      <Text style={[styles.subtitle, { color: colors.text }]}>{t('tracker_history_title')}</Text>

      {sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t('tracker_empty_message')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.sessionCard, { backgroundColor: colors.surface }]}>
              <View style={styles.sessionInfo}>
                <Text style={[styles.sessionSubject, { color: colors.text }]}>
                  {item.subject}
                </Text>
                <Text style={[styles.sessionDate, { color: colors.textSecondary }]}>
                  {item.date}
                </Text>
              </View>

              <Text style={[styles.sessionMinutes, { color: colors.text }]}>
                ⏱️ {item.minutes} min
              </Text>

              <TouchableOpacity
                onPress={() => handleDeleteSession(item.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={20} color="#E53935" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 12 },
  statsCard: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: { fontSize: 14 },
  statsValue: { fontSize: 28, fontWeight: 'bold', marginTop: 4 },
  timerContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  timerText: { fontSize: 42, fontWeight: 'bold', marginVertical: 10 },
  buttonRow: { flexDirection: 'row', gap: 8 },
  timerButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  sessionInfo: { flex: 1 },
  sessionSubject: { fontSize: 16, fontWeight: '600' },
  sessionDate: { fontSize: 12, marginTop: 2 },
  sessionMinutes: { fontSize: 14, fontWeight: 'bold', marginHorizontal: 10 },
  deleteButton: { padding: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 20 },
  emptyText: { fontSize: 14 },
});