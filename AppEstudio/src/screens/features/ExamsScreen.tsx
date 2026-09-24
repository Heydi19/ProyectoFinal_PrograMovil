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
import { useTheme } from '../../Context/ThemeNavigator';
import { useLanguage } from '../../Context/LanguageContext';

interface Exam {
  id: string;
  subject: string;
  title: string;
  date: string;
  time: string;
}

export default function ExamsScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [exams, setExams] = useState<Exam[]>([]);

  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

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

    setSubject('');
    setTitle('');
    setDate('');
    setTime('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('exams_header_title')}</Text>
      </View>

      {/* Formulario */}
      <View style={[styles.formContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.formTitle, { color: colors.text }]}>{t('exams_form_title')}</Text>

        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholder={t('exams_subject_placeholder')}
          placeholderTextColor={colors.textSecondary}
          value={subject}
          onChangeText={setSubject}
        />
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholder={t('exams_description_placeholder')}
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />
        <View style={styles.rowInputs}>
          <TextInput
            style={[styles.input, styles.halfInput, { color: colors.text, borderColor: colors.border }]}
            placeholder={t('exams_date_placeholder')}
            placeholderTextColor={colors.textSecondary}
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={[styles.input, styles.halfInput, { color: colors.text, borderColor: colors.border }]}
            placeholder={t('exams_time_placeholder')}
            placeholderTextColor={colors.textSecondary}
            value={time}
            onChangeText={setTime}
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddExam}>
          <Text style={styles.addButtonText}>{t('exams_save_button')}</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de próximos exámenes */}
      <Text style={[styles.subtitle, { color: colors.text }]}>{t('exams_upcoming_title')}</Text>

      {exams.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t('exams_empty_message')}
          </Text>
        </View>
      ) : (
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
      )}
    </SafeAreaView>
  );
}

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
  emptyContainer: { alignItems: 'center', marginTop: 20 },
  emptyText: { fontSize: 14 },
});