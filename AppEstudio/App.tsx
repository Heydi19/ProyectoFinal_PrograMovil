import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/Navegation/StackNavegation';


export default function App() {
  return (
    // Encapsula toda la estructura de rutas mediante el NavigationContainer
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
}

