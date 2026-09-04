import React, { useState } from "react";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { KeyboardTypeOptions, StyleSheet, TextInput, TouchableOpacity, View, Text } from "react-native";

type CustomInputProps = {
    placeholder: string;
    value: string;
    onChangeText: (text:string) => void;
    type?: "default" | "password" | "email" | "number" | "user";
};

export default function CustomInput({
    placeholder,
  value,
  onChangeText,
  type = "default"
}: CustomInputProps) {
  const [isSecureText, setIsSecureText] = useState(type === "password");
  const isPasswordField = type === "password";

  const iconName: (typeof MaterialIcons)["name"] | undefined =
    type === "password" ? "lock" :
      type === "email" ? "alternate-email" :
        type === "number" ? "phone": 
          type === "user" ? "person" : undefined;

  const keyboardType: KeyboardTypeOptions =
    type === "email"
      ? "email-address"
      : type === "number"
        ? "number-pad"
        : "default";

  // Validación rápida de errores
  const getError = () => {
    if (type === "email" && value.length > 0 && !value.includes("@")) {
      return "Correo inválido";
    }
    if (type === "password" && value.length > 0 && value.length < 6) {
      return "La contraseña es débil";
    }
    return null;
  };

  const error = getError();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        {iconName && <MaterialIcons name={iconName as any} size={20} color="#206291" style={styles.leftIcon} />}
        
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#888"
          keyboardType={keyboardType}
          secureTextEntry={isSecureText}
          autoCapitalize="none"
        />

        {isPasswordField && (
          <TouchableOpacity onPress={() => setIsSecureText(!isSecureText)}>
            <Ionicons name={isSecureText ? "eye-off" : "eye"} size={20} color="#206291" />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: '#F0F4F8',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: '#D0D7DE',
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  inputError: {
    borderColor: '#D9534F',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#D9534F',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});