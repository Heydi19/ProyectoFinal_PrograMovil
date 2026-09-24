import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/Navegation/StackNavegation';
import { ThemeProvider } from './src/Context/ThemeNavigator';
import { AuthProvider } from './src/Context/AuthContext';
import { LanguageProvider } from './src/Context/LanguageContext';
import { AppDataProvider } from './src/Context/AppDataContext';

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppDataProvider>
            <NavigationContainer>
              <StackNavigation />
            </NavigationContainer>
          </AppDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}