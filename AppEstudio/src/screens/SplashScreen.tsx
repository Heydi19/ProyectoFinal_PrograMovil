import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// SplashScreen actúa como la primera vista al abrir la app
export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    // Mantiene el logo en pantalla por 3 segundos antes de ir a Login
    const timer = setTimeout(() => {
      // replace elimina Splash del historial para no poder regresar con la flecha de "Atrás"
      navigation.replace('LoginScreen');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.splashContainer}>
      <StatusBar style="light" />
      <Image
        source={require('../../assets/icono3.jpg')}
        style={styles.splashImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#2b3a4e', // Fondo del logo
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
});