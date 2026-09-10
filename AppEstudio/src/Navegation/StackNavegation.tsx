import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from '../screens/LoginScreen';
import Home from '../screens/HomeScreen';
import TabsNavigation from './TabsNavegation';
import Register from '../screens/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';


//Tipado de rutas del Stack 
export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  HomeScreen: { email: string };
  UserTabs: undefined; // Redirección al contenedor de pestañas inferiores
  SplashScreen: undefined;
  
};


// Instancia del Stack Navigator tipado
const Stack = createNativeStackNavigator<RootStackParamList>();

// Componente principal de navegación Stack
export default function StackNavigation() {
  return (
    <Stack.Navigator 
      initialRouteName="SplashScreen"
      screenOptions={{ headerShown: false }} // Oculta el encabezado superior predeterminado
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="LoginScreen" component={Login} />
      <Stack.Screen name="RegisterScreen" component={Register} />
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="UserTabs" component={TabsNavigation} />
    </Stack.Navigator>
  );
}