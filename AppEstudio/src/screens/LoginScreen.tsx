import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import CustomInput from '../Components/CustomInput';
import CustomButton from '../Components/CustomButton';
import { useAuth } from '../Context/AuthContext';
import { useLanguage } from '../Context/LanguageContext';
import { supabase } from '../lib/supabase';

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const { t } = useLanguage();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t('login_error_empty'), t('login_error_empty'));
      return;
    }

    try {
      await login(email.trim(), password);
      navigation.replace('UserTabs', {
        screen: 'HomeTab',
        params: { email: email.trim() },
      });
    } catch (error: any) {
      console.log('Error al iniciar sesión:', error.message);
      Alert.alert(t('login_error_title'), error.message ?? t('login_error_default'));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const ok = await loginWithGoogle();
      if (ok) {
        const { data } = await supabase.auth.getSession();
        navigation.replace('UserTabs', {
          screen: 'HomeTab',
          params: { email: data.session?.user?.email ?? '' },
        });
      }
    } catch (error: any) {
      console.log('Error al iniciar sesión con Google:', error.message);
      Alert.alert(t('login_error_title'), error.message ?? 'No se pudo iniciar sesión con Google');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.formContainer}>
        <Text style={styles.title}>{t('login_title')}</Text>

        <CustomInput
          placeholder={t('login_email_placeholder')}
          value={email}
          onChangeText={setEmail}
          type="email"
        />

        <CustomInput
          placeholder={t('login_password_placeholder')}
          value={password}
          onChangeText={setPassword}
          type="password"
        />

        <View style={styles.buttonSpacing}>
          <CustomButton title={t('login_button')} onPress={handleLogin} variant="primary" />
        </View>

        {/* Botón de Google con icono */}
        <View style={styles.buttonSpacing}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
          >
            <AntDesign name="google" size={20} color="#DB4437" />
            <Text style={styles.googleText}>Continuar con Google</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.toggleText}>{t('login_no_account')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', paddingHorizontal: 25 },
  formContainer: { alignItems: 'center', width: '100%' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#206291', marginBottom: 30 },
  buttonSpacing: { marginTop: 15, width: '100%', alignItems: 'center' },
  toggleText: { color: '#206291', marginTop: 20, fontSize: 14, textDecorationLine: 'underline' },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#206291',
    backgroundColor: '#fff',
  },
  googleText: { color: '#206291', fontSize: 16, fontWeight: '600' },
});