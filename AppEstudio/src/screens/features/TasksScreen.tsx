import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useTheme } from '../../Context/ThemeNavigator';
import { useLanguage } from '../../Context/LanguageContext';

interface Task {
  id: string;
  title: string;
  subject: string;
  professor: string;
  completed: boolean;
}

export default function TasksScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  // Estados del formulario para nueva tarea
  const [taskTitle, setTaskTitle] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [professorName, setProfessorName] = useState('');

  // Estados para el modal de edición
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editProfessor, setEditProfessor] = useState('');

  // Lista de tareas vacía por defecto para nuevos usuarios
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = () => {
    if (!taskTitle.trim() || !subjectName.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle.trim(),
      subject: subjectName.trim(),
      professor: professorName.trim() || t('tasks_no_professor'),
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setTaskTitle('');
    setSubjectName('');
    setProfessorName('');
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditSubject(task.subject);
    setEditProfessor(task.professor);
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editSubject.trim()) return;

    setTasks(
      tasks.map((task) =>
        task.id === editingTaskId
          ? {
              ...task,
              title: editTitle.trim(),
              subject: editSubject.trim(),
              professor: editProfessor.trim() || t('tasks_no_professor'),
            }
          : task
      )
    );

    setIsEditModalVisible(false);
    setEditingTaskId(null);
  };

  const handleDeleteTask = (id: string) => {
    Alert.alert('Eliminar tarea', '¿Seguro que quieres eliminar esta tarea?', [
      { text: t('tasks_cancel'), style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => setTasks((prev) => prev.filter((task) => task.id !== id)),
      },
    ]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    const key = task.subject;
    if (!acc[key]) {
      acc[key] = {
        professor: task.professor,
        items: [],
      };
    }
    acc[key].items.push(task);
    return acc;
  }, {} as Record<string, { professor: string; items: Task[] }>);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('tasks_header_title')}</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {t('tasks_header_subtitle')}
          </Text>
        </View>

        {/* Formulario para agregar tarea */}
        <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.formTitle, { color: colors.text }]}>{t('tasks_form_title')}</Text>

          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            placeholder={t('tasks_title_placeholder')}
            placeholderTextColor={colors.textSecondary}
            value={taskTitle}
            onChangeText={setTaskTitle}
          />

          <View style={styles.rowInputs}>
            <TextInput
              style={[styles.input, styles.halfInput, { color: colors.text, borderColor: colors.border }]}
              placeholder={t('tasks_subject_placeholder')}
              placeholderTextColor={colors.textSecondary}
              value={subjectName}
              onChangeText={setSubjectName}
            />

            <TextInput
              style={[styles.input, styles.halfInput, { color: colors.text, borderColor: colors.border }]}
              placeholder={t('tasks_professor_placeholder')}
              placeholderTextColor={colors.textSecondary}
              value={professorName}
              onChangeText={setProfessorName}
            />
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
            <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>{t('tasks_add_button')}</Text>
          </TouchableOpacity>
        </View>

        {/* Mensaje de estado vacío si no hay tareas */}
        {tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-done-circle-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('tasks_empty_message')}
            </Text>
          </View>
        ) : (
          Object.keys(groupedTasks).map((subject) => {
            const group = groupedTasks[subject];
            return (
              <View key={subject} style={styles.subjectGroup}>
                <View style={styles.subjectHeader}>
                  <View style={styles.subjectBadge}>
                    <Ionicons name="book-outline" size={16} color={colors.primary} />
                    <Text style={[styles.subjectTitle, { color: colors.text }]}>{subject}</Text>
                  </View>
                  <Text style={[styles.professorText, { color: colors.textSecondary }]}>
                    👨‍🏫 {group.professor}
                  </Text>
                </View>

                {group.items.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.taskCard,
                      { backgroundColor: colors.surface },
                      item.completed && styles.taskCompletedCard,
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.taskTitleContainer}
                      onPress={() => toggleTaskComplete(item.id)}
                    >
                      <Text
                        style={[
                          styles.taskText,
                          { color: colors.text },
                          item.completed && styles.taskCompletedText,
                        ]}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        onPress={() => handleOpenEditModal(item)}
                        style={styles.iconButton}
                      >
                        <Ionicons name="create-outline" size={20} color={colors.primary} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDeleteTask(item.id)}
                        style={styles.iconButton}
                      >
                        <Ionicons name="trash-outline" size={20} color="#E53935" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => toggleTaskComplete(item.id)}
                        style={styles.iconButton}
                      >
                        <Ionicons
                          name={item.completed ? 'checkbox' : 'square-outline'}
                          size={22}
                          color={item.completed ? '#4CAF50' : colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            );
          })
        )}

      </ScrollView>

      {/* MODAL DE EDICIÓN */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('tasks_edit_modal_title')}</Text>

            <Text style={[styles.label, { color: colors.textSecondary }]}>{t('tasks_edit_title_label')}</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={editTitle}
              onChangeText={setEditTitle}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>{t('tasks_edit_subject_label')}</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={editSubject}
              onChangeText={setEditSubject}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>{t('tasks_edit_professor_label')}</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={editProfessor}
              onChangeText={setEditProfessor}
            />

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
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  header: { marginTop: 8, marginBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 13, marginTop: 2 },
  formCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  formTitle: { fontSize: 15, fontWeight: '600', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  rowInputs: { flexDirection: 'row', gap: 8 },
  halfInput: { flex: 1 },
  addButton: {
    backgroundColor: '#1d6395',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    marginTop: 2,
  },
  addButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  subjectGroup: { marginBottom: 18 },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  subjectBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  subjectTitle: { fontSize: 16, fontWeight: '700' },
  professorText: { fontSize: 12, fontWeight: '500' },
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  taskCompletedCard: { opacity: 0.6 },
  taskTitleContainer: { flex: 1, marginRight: 8 },
  taskText: { fontSize: 15, fontWeight: '500' },
  taskCompletedText: { textDecorationLine: 'line-through' },
  actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconButton: { padding: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: { width: '100%', borderRadius: 16, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 12 },
  modalButton: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  cancelButton: { backgroundColor: '#E0E0E0' },
  cancelButtonText: { color: '#333333', fontWeight: '600' },
  saveButton: { backgroundColor: '#1d6395' },
  saveButtonText: { color: '#FFFFFF', fontWeight: '600' },
});