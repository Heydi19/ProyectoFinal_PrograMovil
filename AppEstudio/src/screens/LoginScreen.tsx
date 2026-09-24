import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import CustomInput from '../Components/CustomInput';
import CustomButton from '../Components/CustomButton';
import { useAuth } from '../Context/AuthContext';
import { useLanguage } from '../Context/LanguageContext';

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
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
});