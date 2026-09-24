import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import CustomInput from '../Components/CustomInput';
import CustomButton from '../Components/CustomButton';
import { useAuth } from '../Context/AuthContext';
import { useLanguage } from '../Context/LanguageContext';

export default function Register({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [career, setCareer] = useState('');
  const [phone, setPhone] = useState('');
  const { register } = useAuth();
  const { t } = useLanguage();

  const validateForm = () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !career.trim()) {
      Alert.alert(t('register_incomplete_title'), t('register_incomplete_message'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert(t('register_invalid_email_title'), t('register_invalid_email_message'));
      return false;
    }

    // Solo se permite registro con correo institucional (.edu, .edu.hn, etc.)
    if (!email.trim().toLowerCase().includes('.edu')) {
      Alert.alert(t('register_edu_email_title'), t('register_edu_email_message'));
      return false;
    }

    if (password.length < 6) {
      Alert.alert(t('register_weak_password_title'), t('register_weak_password_message'));
      return false;
    }

    // Teléfono es opcional: solo se valida el formato SI se llenó
    if (phone.trim() && !/^[0-9]{8,15}$/.test(phone.trim())) {
      Alert.alert(t('register_invalid_phone_title'), t('register_invalid_phone_message'));
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register(email.trim(), password, {
        fullName: fullName.trim(),
        career: career.trim(),
        phone: phone.trim() || undefined,
      });
      Alert.alert(t('register_success_title'), t('register_success_message'), [
        { text: t('register_continue'), onPress: () => navigation.navigate('LoginScreen') },
      ]);
    } catch (error: any) {
      console.log('Error al registrarse:', error.message);
      Alert.alert(t('register_error_title'), error.message ?? t('register_error_default'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>{t('register_title')}</Text>
          <Text style={styles.subtitle}>{t('register_subtitle')}</Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            placeholder={t('register_fullname_placeholder')}
            value={fullName}
            onChangeText={setFullName}
            type="user"
          />

          <CustomInput
            placeholder={t('register_email_placeholder')}
            value={email}
            onChangeText={setEmail}
            type="email"
          />

          <CustomInput
            placeholder={t('register_password_placeholder')}
            value={password}
            onChangeText={setPassword}
            type="password"
          />

          <CustomInput
            placeholder={t('register_career_placeholder')}
            value={career}
            onChangeText={setCareer}
            type="user"
          />

          <CustomInput
            placeholder={t('register_phone_placeholder')}
            value={phone}
            onChangeText={setPhone}
            type="number"
            required= {false}
          />

          <View style={styles.buttonSpacing}>
            <CustomButton title={t('register_button')} onPress={handleRegister} variant="primary" />
          </View>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={styles.toggleText}>{t('register_have_account')}</Text>
            <Text style={styles.toggleTextBold}>{t('register_login_link')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 25, paddingVertical: 20 },
  headerContainer: { alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#206291', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666666' },
  formContainer: { width: '100%', alignItems: 'center' },
  buttonSpacing: { marginTop: 20, width: '100%', alignItems: 'center' },
  linkContainer: { flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'center' },
  toggleText: { color: '#555555', fontSize: 14 },
  toggleTextBold: { color: '#206291', fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline' },
});