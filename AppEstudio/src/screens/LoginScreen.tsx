import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import CustomInput from "../Components/CustomInput";
import CustomButton from "../Components/CustomButton";
import { isRequired, isValidEmail, isValidPassword } from "../utils/validators";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isFormValid =
    isRequired(email) && isValidEmail(email) && isRequired(password) && isValidPassword(password);

  const handleLogin = () => {
    setSubmitted(true);
    if (!isFormValid) return;

    console.log("Login presionado: ", { email, password });
    navigation.reset({ index: 0, routes: [{ name: "Main" }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Iniciar Sesion</Text>

        <CustomInput
          placeholder="Ingresa tu correo"
          value={email}
          onChangeText={setEmail}
          type="email"
          forceShowError={submitted}
        />

        <CustomInput
          placeholder="Ingresa tu Contraseña"
          value={password}
          onChangeText={setPassword}
          type="password"
          forceShowError={submitted}
        />

        <View style={styles.buttonSpacing}>
          <CustomButton title="Iniciar Sesion" onPress={handleLogin} variant="primary" />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.toggleText}>¿No tienes una cuenta? Registrate aqui</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", paddingHorizontal: 25 },
  formContainer: { alignItems: "center", width: "100%" },
  title: { fontSize: 26, fontWeight: "bold", color: "#206291", marginBottom: 30 },
  buttonSpacing: { marginTop: 15, width: "100%", alignItems: "center" },
  toggleText: { color: "#206291", marginTop: 20, fontSize: 14, textDecorationLine: "underline" },
});