import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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

  // Formulario para agregar
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Modal de edición
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  const handleAddExam = () => {
    if (!subject.trim() || !title.trim() || !date.trim()) return;

    const newExam: Exam = {
      id: Date.now().toString(),
      subject: subject.trim(),
      title: title.trim(),
      date: date.trim(),
      time: time.trim() ? time.trim() : '10:00',
    };

    setExams([...exams, newExam]);

    setSubject('');
    setTitle('');
    setDate('');
    setTime('');
  };

  const handleOpenEditModal = (exam: Exam) => {
    setEditingExamId(exam.id);
    setEditSubject(exam.subject);
    setEditTitle(exam.title);
    setEditDate(exam.date);
    setEditTime(exam.time);
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editSubject.trim() || !editTitle.trim() || !editDate.trim()) return;

    setExams((prev) =>
      prev.map((exam) =>
        exam.id === editingExamId
          ? {
              ...exam,
              subject: editSubject.trim(),
              title: editTitle.trim(),
              date: editDate.trim(),
              time: editTime.trim() ? editTime.trim() : '10:00',
            }
          : exam
      )
    );

    setIsEditModalVisible(false);
    setEditingExamId(null);
  };

  const handleDeleteExam = (id: string) => {
    Alert.alert('Eliminar examen', '¿Seguro que quieres eliminar este examen?', [
      { text: t('tasks_cancel'), style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => setExams((prev) => prev.filter((exam) => exam.id !== id)),
      },
    ]);
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

              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => handleOpenEditModal(item)} style={styles.iconButton}>
                  <Ionicons name="create-outline" size={20} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDeleteExam(item.id)} style={styles.iconButton}>
                  <Ionicons name="trash-outline" size={20} color="#E53935" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* MODAL DE EDICIÓN */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Editar examen</Text>

            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder={t('exams_subject_placeholder')}
              placeholderTextColor={colors.textSecondary}
              value={editSubject}
              onChangeText={setEditSubject}
            />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder={t('exams_description_placeholder')}
              placeholderTextColor={colors.textSecondary}
              value={editTitle}
              onChangeText={setEditTitle}
            />
            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.input, styles.halfInput, { color: colors.text, borderColor: colors.border }]}
                placeholder={t('exams_date_placeholder')}
                placeholderTextColor={colors.textSecondary}
                value={editDate}
                onChangeText={setEditDate}
              />
              <TextInput
                style={[styles.input, styles.halfInput, { color: colors.text, borderColor: colors.border }]}
                placeholder={t('exams_time_placeholder')}
                placeholderTextColor={colors.textSecondary}
                value={editTime}
                onChangeText={setEditTime}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t('tasks_cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>{t('tasks_save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 8 },
  iconButton: { padding: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 20 },
  emptyText: { fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: { width: '100%', borderRadius: 16, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 12 },
  modalButton: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  cancelButton: { backgroundColor: '#E0E0E0' },
  cancelButtonText: { color: '#333333', fontWeight: '600' },
  saveButton: { backgroundColor: '#206291' },
  saveButtonText: { color: '#FFFFFF', fontWeight: '600' },
});