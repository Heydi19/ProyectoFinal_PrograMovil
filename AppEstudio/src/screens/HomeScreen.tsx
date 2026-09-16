import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navegation/StackNavegation";
import { useTheme } from "../Context/ThemeNavigator";


type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "HomeScreen">;

// Usamos any o tipado opcional para permitir que funcione tanto en Stack como en Tabs
export default function Home({ route }: any ) {

    //Extraemos los colores dinamicos del tema
    const {colors} = useTheme();

    // Usamos encadenamiento opcional (?.) por si no se recibe el parámetro email
    const {email} = route.params ?? { email: "Usuario" }; // Valor por defecto si no se recibe email

    return (
        //se aplican colores dinamicos en los estilos en linea combinados
        <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
            <View style={styles.content}>
                <Text style={[styles.title, {color: colors.text}]}>¡Bienvenido!</Text>
                <Text style={[styles.subtitle, {color: colors.textSecondary}]}>{email}</Text>
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
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
});