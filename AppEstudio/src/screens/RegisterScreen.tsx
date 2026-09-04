import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import CustomInput from '../Components/CustomInput';
import CustomButton from '../Components/CustomButton';




export default function Register({ navigation }: any) {
  // Manejo de estado para los inputs obligatorios solicitados
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Validar campos obligatorios, formato de email, teléfono y contraseña
  const validateForm = () => {
    // Campos obligatorios
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos obligatorios.');
      return false;
    }

    // Email válido (Expresión regular)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Email inválido', 'Por favor ingresa un formato de correo electrónico válido.');
      return false;
    }

    // Input de teléfono (Mínimo 8 dígitos)
    const phoneRegex = /^[0-9]{8,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      Alert.alert('Teléfono inválido', 'El número de teléfono debe contener entre 8 y 15 dígitos numéricos.');
      return false;
    }

    // Input tipo contraseña (Mínimo 6 caracteres)
    if (password.length < 6) {
      Alert.alert('Contraseña débil', 'La contraseña debe tener al menos 6 caracteres.');
      return false;
    }

    return true;
  };

  // Acción del botón Registrarse
  const handleRegister = () => {
    if (validateForm()) {
      Alert.alert('¡Registro Exitoso!', 'Tu cuenta ha sido creada correctamente.', [
        {
          text: 'Continuar',
          // Redirección de pantalla según el Stack Navigation
          onPress: () => navigation.navigate('LoginScreen'),
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Encabezado visualmente coherente */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Completa tus datos para empezar</Text>
        </View>

        {/* Formulario usando flexbox */}
        <View style={styles.formContainer}>
          
          {/* Input de tipo Texto (Nombre) */}
          <CustomInput
            placeholder="Nombre completo"
            value={fullName}
            onChangeText={setFullName}
            type="user" 
          />

          {/* Input de tipo Email */}
          <CustomInput
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            type="email"
          />

          {/* Input de tipo Teléfono */}
          <CustomInput
            placeholder="Número de teléfono"
            value={phone}
            onChangeText={setPhone}
            type="number"
          />

          {/* Input de tipo Contraseña */}
          <CustomInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            type="password"
          />

          {/* Botón reutilizable con estilo condicional */}
          <View style={styles.buttonSpacing}>
            <CustomButton title="Registrarse" onPress={handleRegister} variant="primary" />
          </View>

          {/* Enlace de navegación para volver a Login */}
          <TouchableOpacity 
            style={styles.linkContainer}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={styles.toggleText}>¿Ya tienes cuenta? </Text>
            <Text style={styles.toggleTextBold}>Inicia sesión aquí</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilización con Flexbox (flexDirection, justifyContent, alignItems)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#206291',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonSpacing: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  linkContainer: {
    flexDirection: 'row', // Uso claro de flexDirection para alinear el texto
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    color: '#555555',
    fontSize: 14,
  },
  toggleTextBold: {
    color: '#206291',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});