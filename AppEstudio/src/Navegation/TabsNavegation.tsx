import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useTheme } from '../Context/ThemeNavigator';
import HomeScreen from '../screens/features/HomeScreen';
import TasksScreen from '../screens/features/TasksScreen';
import StudyTrackerScreen from '../screens/features/StudyTrackerScreen';
import ExamsScreen from '../screens/features/ExamsScreen';
import Profile from "../screens/features/Profile";
import Settings from "../screens/features/Settings";

// 1. Tipado actualizado de las pestañas inferiores
export type TabParamList = {
  HomeTab: { email: string };
  tasks: undefined;
  tracker: undefined;
  exams: undefined;
  profile: undefined;
  settings: undefined;
};

// Instancia del Tab Navigator
const Tab = createBottomTabNavigator<TabParamList>();

// Componente de navegación por pestañas inferiores
export default function TabsNavigation() {
  // Consumimos los colores del tema activo (modo claro/oscuro)
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      // screenOptions permite configurar aspectos globales de la barra para todas las pestañas
      screenOptions={({ route }) => ({
        headerShown: false, // Ocultamos el encabezado superior
        tabBarActiveTintColor: colors.primary, // Color para la pestaña seleccionada
        tabBarInactiveTintColor: colors.textSecondary, // Color para las pestañas inactivas

        tabBarStyle: {
          backgroundColor: colors.surface, // Fondo dinámico de la barra según el tema
          borderTopColor: colors.border,   // Borde superior dinámico
        },

        // Función dinámica para renderizar el icono según la ruta activa
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          // Asignación de icono vectorial según el nombre de la ruta
          if (route.name === 'HomeTab') {
            iconName = 'home-outline';         // Icono de inicio
          } else if (route.name === 'tasks') {
            iconName = 'checkbox-outline';     // Icono de tareas (checklist)
          } else if (route.name === 'tracker') {
            iconName = 'time-outline';         // Icono de horas/cronómetro
          } else if (route.name === 'exams') {
            iconName = 'calendar-outline';     // Icono de calendario de exámenes
          } else if (route.name === 'profile') {
            iconName = 'person-outline';       // Icono de perfil
          } else if (route.name === 'settings') {
            iconName = 'settings-outline';     // Icono de ajustes
          }

          // Retorna el componente de icono vectorial con el color y tamaño del sistema
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        children={(props: any) => <HomeScreen {...props} />}
        options={{ title: 'Inicio' }} 
      />
      <Tab.Screen 
        name="tasks" 
        component={TasksScreen} 
        options={{ title: 'Tareas' }} 
      />
      <Tab.Screen 
        name="tracker" 
        component={StudyTrackerScreen} 
        options={{ title: 'Horas' }} 
      />
      <Tab.Screen 
        name="exams" 
        component={ExamsScreen} 
        options={{ title: 'Exámenes' }} 
      />
      <Tab.Screen 
        name="profile" 
        component={Profile} 
        options={{ title: 'Perfil' }} 
      />
      <Tab.Screen 
        name="settings" 
        component={Settings} 
        options={{ title: 'Ajustes' }} 
      />
    </Tab.Navigator>
  );
}