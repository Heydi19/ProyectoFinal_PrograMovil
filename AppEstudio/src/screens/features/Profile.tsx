import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Perfil de Usuario </Text>
        <Text style={styles.subtitle}>Gestión de datos personales y preferencias.</Text>
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
});