import React from 'react';
import { View, Text, StyleSheet, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../Components/CustomButton';
import { useTheme } from '../../Context/ThemeNavigator';
import { Ionicons } from '@expo/vector-icons';


export default function Settings({navigation}: any) {
  const {isDark, colors, toggleTheme} = useTheme();

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
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.content}>
        <Ionicons
          name = {isDark ? 'moon' : 'sunny'}
          size = {64}
          color={colors.primary}
          style = {styles.icon}
          />

        {/* Título y subtítulo con color de texto dinámico */}
        <Text style={[styles.title, { color: colors.text }]}>
          tema: {isDark ? 'Oscuro' : 'Claro'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Opciones de la cuenta y preferencias de interfaz.
        </Text>

        {/* Control Switch para cambiar entre Modo Claro y Oscuro */}
        <View style = {styles.switchRow}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>
             Desactivar modo oscuro
          </Text>
        <Switch
        value = {isDark}
        onValueChange={toggleTheme}
        thumbColor={isDark ? colors.primary : '#f4f3f4'}
        trackColor={{false: '#ccc', true: colors.primary}}
        />
        </View>

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
  icon: {
    marginBottom: 15,
},
  title: { 
    fontSize: 24, 
    fontWeight: 'bold',  
    marginBottom: 8,
    textAlign: 'center', 
},
  subtitle: { 
    fontSize: 14, 
    textAlign: 'center', 
    marginBottom: 30,
 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
    switchLabel: {
      fontSize: 16,
      fontWeight: '500',
    },
 buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
});