import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../Context/ThemeNavigator';

interface StudySession {
  id: string;
  subject: string;
  minutes: number;
  date: string;
}

export default function StudyTrackerScreen() {
  const { colors } = useTheme();

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [subject, setSubject] = useState('');

  // Arreglo inicial vacío para nuevos usuarios
  const [sessions, setSessions] = useState<StudySession[]>([]);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0 && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const toggleTimer = () => {
    if (!subject.trim()) return;
    setIsActive(!isActive);
  };

  const saveSession = () => {
    if (seconds === 0 || !subject.trim()) return;

    const newSession: StudySession = {
      id: Date.now().toString(),
      subject: subject,
      minutes: Math.max(1, Math.floor(seconds / 60)),
      date: 'Hoy',
    };

    setSessions([newSession, ...sessions]);
    setSeconds(0);
    setIsActive(false);
    setSubject('');
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
        <Text style={[styles.title, { color: colors.text }]}>Registro de Estudio</Text>
      </View>

      {/* Tarjeta de Estadísticas de Progreso */}
      <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.statsTitle, { color: colors.textSecondary }]}>
          Tiempo Total Registrado
        </Text>
        <Text style={[styles.statsValue, { color: colors.text }]}>
          {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
        </Text>
      </View>

      {/* Selector/Materia y Cronómetro */}
      <View style={[styles.timerContainer, { backgroundColor: colors.surface }]}>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholder="Asignatura a estudiar (ej. Prog. Móvil)..."
          placeholderTextColor={colors.textSecondary}
          value={subject}
          onChangeText={setSubject}
          editable={!isActive}
        />

        <Text style={[styles.timerText, { color: colors.text }]}>
          {formatTime(seconds)}
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.timerButton,
              { backgroundColor: isActive ? '#d32f2f' : '#206291' },
            ]}
            onPress={toggleTimer}
          >
            <Text style={styles.buttonText}>
              {isActive ? 'Pausar' : 'Iniciar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.timerButton, { backgroundColor: '#388e3c' }]}
            onPress={saveSession}
          >
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Historial de Sesiones */}
      <Text style={[styles.subtitle, { color: colors.text }]}>Historial Reciente</Text>
      
      {sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Aún no has registrado sesiones de estudio.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.sessionCard, { backgroundColor: colors.surface }]}>
              <View>
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
  buttonRow: { flexDirection: 'row', gap: 10 },
  timerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
  sessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  sessionSubject: { fontSize: 16, fontWeight: '600' },
  sessionDate: { fontSize: 12, marginTop: 2 },
  sessionMinutes: { fontSize: 14, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 20 },
  emptyText: { fontSize: 14 },
});