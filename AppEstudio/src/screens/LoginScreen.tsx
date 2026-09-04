import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import CustomInput from '../Components/CustomInput';
import CustomButton from '../Components/CustomButton';

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => { //Aqui si email y password estan vacios, se muestra un alert y no se redirige a la pantalla de Home
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }
    // Enviamos el correo a la ruta UserTabs pasándolo hacia la pestaña HomeTab 
    navigation.replace('UserTabs', {
      screen: 'HomeTab',
      params: { email: email.trim() },
    });
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <CustomInput
          placeholder="Ingresa tu correo"
          value={email}
          onChangeText={setEmail}
          type="email"
        />

        <CustomInput
          placeholder="Ingresa tu contraseña"
          value={password}
          onChangeText={setPassword}
          type="password"
        />

        <View style={styles.buttonSpacing}>
          <CustomButton title="Iniciar Sesión" onPress={handleLogin} variant="primary" />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.toggleText}>¿No tienes cuenta? Regístrate aquí</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    paddingHorizontal: 25 
},
  formContainer: { 
    alignItems: 'center', 
    width: '100%' 
},
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#206291', 
    marginBottom: 30 
},
  buttonSpacing: { 
    marginTop: 15, 
    width: '100%', 
    alignItems: 'center' 
},
  toggleText: { 
    color: '#206291', 
    marginTop: 20, 
    fontSize: 14, 
    textDecorationLine: 'underline' 
},
});