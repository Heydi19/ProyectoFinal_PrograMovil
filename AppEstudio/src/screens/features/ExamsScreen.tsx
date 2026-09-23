// 1. IMPORTACIONES DE REACT Y REACT NATIVE
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importación del hook para el tema (Modo Claro/Oscuro)
import { useTheme } from '../../Context/ThemeNavigator';

// 2. DEFINICIÓN DE TIPOS (TYPESCRIPT)
interface Exam {
  id: string;
  subject: string;
  title: string;
  date: string;
  time: string;
}

export default function ExamsScreen() {
  // 3. CONTEXTO Y ESTADOS LOCALES
  const { colors } = useTheme();

  // Lista de exámenes iniciales de ejemplo
  const [exams, setExams] = useState<Exam[]>([
    { id: '1', subject: 'Prog. Móvil', title: 'Examen Parcial 1', date: '2026-09-28', time: '18:00' },
    { id: '2', subject: 'Base de Datos', title: 'Evaluación Práctica', date: '2026-10-02', time: '14:00' },
  ]);

  // Estados para el formulario de registro
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // 4. FUNCIONES LÓGICAS
  const handleAddExam = () => {
    if (!subject.trim() || !title.trim() || !date.trim()) return;

    const newExam: Exam = {
      id: Date.now().toString(),
      subject,
      title,
      date,
      time: time.trim() ? time : '10:00',
    };

    setExams([...exams, newExam]);

    // Limpiar campos
    setSubject('');
    setTitle('');
    setDate('');
    setTime('');
  };

  // 5. INTERFAZ VISUAL (RENDER)
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Calendario de Exámenes</Text>
      </View>

      {/* Formulario para registrar un nuevo examen */}
      <View style={[styles.formContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.formTitle, { color: colors.text }]}>Programar Nuevo Examen</Text>
        
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholder="Materia (ej. Prog. Móvil)..."
          placeholderTextColor={colors.textSecondary}
          value={subject}
          onChangeText={setSubject}
        />
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholder="Nombre/Descripción del examen..."
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />
        <View style={styles.rowInputs}>
          <TextInput
            style={[styles.input, styles.halfInput, { color: colors.text, borderColor: colors.border }]}
            placeholder="Fecha (AAAA-MM-DD)"
            placeholderTextColor={colors.textSecondary}
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={[styles.input, styles.halfInput, { color: colors.text, borderColor: colors.border }]}
            placeholder="Hora (ej. 14:00)"
            placeholderTextColor={colors.textSecondary}
            value={time}
            onChangeText={setTime}
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddExam}>
          <Text style={styles.addButtonText}>Guardar Examen</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de próximos exámenes */}
      <Text style={[styles.subtitle, { color: colors.text }]}>Próximas Evaluaciones</Text>

      <FlatList
        data={exams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.examCard, { backgroundColor: colors.surface }]}>
            <View style={styles.examBadge}>
              <Text style={styles.examBadgeText}>📅 {item.date}</Text>
              <Text style={styles.examTimeText}>⏰ {item.time}</Text>
            </View>
            <View style={styles.examInfo}>
              <Text style={[styles.examSubject, { color: colors.text }]}>{item.subject}</Text>
              <Text style={[styles.examTitle, { color: colors.textSecondary }]}>{item.title}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// 6. ESTILOS
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 12 },
  formContainer: { padding: 16, borderRadius: 8, marginBottom: 12 },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  halfInput: { flex: 1 },
  addButton: {
    backgroundColor: '#206291',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: { color: '#ffffff', fontWeight: 'bold' },
  examCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  examBadge: {
    backgroundColor: '#20629122',
    padding: 8,
    borderRadius: 6,
    marginRight: 12,
    alignItems: 'center',
  },
  examBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#206291' },
  examTimeText: { fontSize: 11, color: '#206291', marginTop: 2 },
  examInfo: { flex: 1 },
  examSubject: { fontSize: 16, fontWeight: 'bold' },
  examTitle: { fontSize: 13, marginTop: 2 },
});