import React, { use } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../Context/ThemeNavigator';

export default function Profile() {
  const {colors} = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Perfil de Usuario</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Gestión de datos personales y preferencias.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
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
    marginBottom: 10 
},
  subtitle: { 
    fontSize: 14, 
    textAlign: 'center' 
 },
});