import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/Navegation/StackNavegation';
import { ThemeProvider } from './src/Context/ThemeNavigator';
import TabsNavigation from './src/Navegation/TabsNavegation';
import { AuthProvider } from './src/Context/AuthContext';


export default function App() {
  return (
    // Encapsula toda la estructura de rutas mediante el NavigationContainer
    <ThemeProvider>
      <AuthProvider>
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
    </AuthProvider>
    </ThemeProvider>
  );
}

