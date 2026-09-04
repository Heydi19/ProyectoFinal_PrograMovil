import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "../screens/features/Profile";
import Settings from "../screens/features/Settings";
import HomeScreen from '../screens/HomeScreen';
import Ionicons from '@expo/vector-icons/build/Ionicons';


// Tipado de las pestañas inferiores
export type TabParamList = {
  profile: undefined;
  settings: undefined;
  HomeTab: { email: string };
};

// Instancia del Tab Navigator
const Tab = createBottomTabNavigator<TabParamList>();

// Componente de navegación por pestañas inferiores
export default function TabsNavigation() {
  return (
    <Tab.Navigator
    // screenOptions permite configurar aspectos globales de la barra para todas las pestañas
      screenOptions={({ route }) => ({
        headerShown: false, // aqui ocultamos el encabezado superior
        tabBarActiveTintColor: '#206291', // Color para la pestaña seleccionada
        tabBarInactiveTintColor: '#8e8e93', // Color para las pestañas inactivas

        // Función dinámica para renderizar el icono según la ruta activa
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          // Asignación de icono según el nombre de la ruta
          if (route.name === 'HomeTab') {
            iconName = 'home-outline'; // Icono de casita para la pantalla principal
          } else if (route.name === 'profile') {
            iconName = 'person-outline'; // Icono de usuario para el perfil
          } else if (route.name === 'settings') {
            iconName = 'settings-outline'; // Icono de engranaje para configuración
          }

          // Retorna el componente de icono vectorial con el color y tamaño del sistema
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ title: 'Inicio' }} 
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