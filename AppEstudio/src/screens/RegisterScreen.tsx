import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import CustomInput from "../Components/CustomInput";
import CustomButton from "../Components/CustomButton";
import { isRequired, isValidEmail, isValidPassword, isValidPhone, isValidText } from "../utils/validators";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isFormValid =
    isRequired(name) && isValidText(name) &&
    isRequired(email) && isValidEmail(email) &&
    isRequired(phone) && isValidPhone(phone) &&
    isRequired(password) && isValidPassword(password);

  const handleRegister = () => {
    setSubmitted(true);
    if (!isFormValid) return;

    console.log("Registro presionado: ", { name, email, phone, password });
    navigation.reset({ index: 0, routes: [{ name: "Main" }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Crear cuenta</Text>

        <CustomInput placeholder="Ingresa tu nombre" value={name} onChangeText={setName} type="text" forceShowError={submitted} />
        <CustomInput placeholder="Ingresa tu correo" value={email} onChangeText={setEmail} type="email" forceShowError={submitted} />
        <CustomInput placeholder="Ingresa tu teléfono" value={phone} onChangeText={setPhone} type="phone" forceShowError={submitted} />
        <CustomInput placeholder="Ingresa tu Contraseña" value={password} onChangeText={setPassword} type="password" forceShowError={submitted} />

        <View style={styles.buttonSpacing}>
          <CustomButton title="Registarse" onPress={handleRegister} variant="primary" />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.toggleText}>¿Ya tienes una cuenta? Inicia Sesion</Text>
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