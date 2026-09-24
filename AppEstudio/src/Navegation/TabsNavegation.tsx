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
import { useLanguage } from '../Context/LanguageContext';

// 1. Tipado de las pestañas inferiores
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

export default function TabsNavigation() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,

        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },

        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          if (route.name === 'HomeTab') {
            iconName = 'home-outline';
          } else if (route.name === 'tasks') {
            iconName = 'checkbox-outline';
          } else if (route.name === 'tracker') {
            iconName = 'time-outline';
          } else if (route.name === 'exams') {
            iconName = 'calendar-outline';
          } else if (route.name === 'profile') {
            iconName = 'person-outline';
          } else if (route.name === 'settings') {
            iconName = 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        children={(props: any) => <HomeScreen {...props} />}
        options={{ title: t('nav_home') || 'Inicio' }} 
      />
      <Tab.Screen 
        name="tasks" 
        component={TasksScreen} 
        options={{ title: t('nav_tasks') || 'Tareas' }} 
      />
      <Tab.Screen 
        name="tracker" 
        component={StudyTrackerScreen} 
        options={{ title: t('hours') || 'Horas' }} 
      />
      <Tab.Screen 
        name="exams" 
        component={ExamsScreen} 
        options={{ title: t('exams') || 'Exámenes' }} 
      />
      <Tab.Screen 
        name="profile" 
        component={Profile} 
        options={{ title: t('profile') || 'Perfil' }} 
      />
      <Tab.Screen 
        name="settings" 
        component={Settings} 
        options={{ title: t('settings') || 'Ajustes' }} 
      />
    </Tab.Navigator>
  );
}