import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import CustomCard from "../Components/CustomCard";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Inicio</Text>

        <CustomCard
          title="¡Bienvenido a AppEstudio!"
          subtitle="Este es el tab de inicio de la aplicación."
        />

        <CustomCard
          title="Estilo condicional"
          subtitle="Las tarjetas y botones cambian de color según el estado, por ejemplo el 'variant' de CustomButton."
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#206291", marginBottom: 20 },
});