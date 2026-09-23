import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/build/Ionicons';

import { supabase } from '../../lib/supabase'; // Ajusta la ruta a tu cliente
import { useTheme } from '../../Context/ThemeNavigator';

export default function SettingsScreen({ navigation }: any) {
  const { colors, isDark, toggleTheme } = useTheme();

  // Estados locales para opciones adicionales de configuración
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [examReminders, setExamReminders] = useState(true);

  // Cerrar Sesión
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Ajustes</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Personaliza tu experiencia y gestiona tu cuenta
          </Text>
        </View>

        {/* SECCIÓN 1: APARIENCIA */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Apariencia</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '18' }]}>
                <Ionicons name={isDark ? "moon" : "sunny"} size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.optionTitle, { color: colors.text }]}>Modo Oscuro</Text>
                <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                  {isDark ? 'Tema oscuro activo' : 'Tema claro activo'}
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

        {/* SECCIÓN 2: NOTIFICACIONES */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notificaciones</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#4CAF5018' }]}>
                <Ionicons name="notifications-outline" size={20} color="#4CAF50" />
              </View>
              <View>
                <Text style={[styles.optionTitle, { color: colors.text }]}>Recordatorios de tareas</Text>
                <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                  Alertas sobre entregas pendientes
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
                <Text style={[styles.optionTitle, { color: colors.text }]}>Alertas de Exámenes</Text>
                <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                  Avisos previos a tus evaluaciones
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

        {/* SECCIÓN 3: CUENTA Y SEGURIDAD */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Cuenta y Seguridad</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <TouchableOpacity 
            style={styles.optionRow}
            onPress={() => navigation.navigate('Perfil')}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '18' }]}>
                <Ionicons name="person-outline" size={20} color={colors.primary} />
              </View>

              <Text style={[styles.optionTitle, { color: colors.text }]}>Editar Perfil</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '18' }]}>
                <Ionicons name="key-outline" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.optionTitle, { color: colors.text }]}>Cambiar contraseña</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* SECCIÓN 4: INFORMACIÓN Y SOPORTE */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Información</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#9C27B018' }]}>
                <Ionicons name="help-circle-outline" size={20} color="#9C27B0" />
              </View>
              <Text style={[styles.optionTitle, { color: colors.text }]}>Ayuda y Soporte</Text>
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
                <Text style={[styles.optionTitle, { color: colors.text }]}>Versión de la App</Text>
                <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>v1.0.0</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginTop: 8,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
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
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  optionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
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
  logoutText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});