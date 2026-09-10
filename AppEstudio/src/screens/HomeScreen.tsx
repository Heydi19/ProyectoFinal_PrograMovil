import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navegation/StackNavegation";


type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "HomeScreen">;

// Usamos any o tipado opcional para permitir que funcione tanto en Stack como en Tabs
export default function Home({ route }: any ) {
    // Usamos encadenamiento opcional (?.) por si no se recibe el parámetro email
    const {email} = route.params ?? { email: "Usuario" }; // Valor por defecto si no se recibe email

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>¡Bienvenido!</Text>
                <Text style={styles.subtitle}>{email}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#206291',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});