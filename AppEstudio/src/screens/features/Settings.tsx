import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../Components/CustomButton';

export default function Settings({navigation}: any) {

    const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Salir', 
          style: 'destructive',
          // Redirige al Login limpiando el flujo de pestañas
          onPress: () => navigation.getParent()?.replace('LoginScreen') || navigation.replace('LoginScreen')
        },
      ]
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Configuración </Text>
        <Text style={styles.subtitle}>Opciones de la cuenta y preferencias.</Text>
        {/* Sección de cierre de sesión */}
        <View style={styles.buttonContainer}>
          <CustomButton 
            title="Cerrar Sesión" 
            onPress={handleLogout} 
            variant="secondary" 
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
},
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
},
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#206291', 
    marginBottom: 10 
},
  subtitle: { 
    fontSize: 14, 
    color: '#666', 
    textAlign: 'center' 
 },
 buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
});