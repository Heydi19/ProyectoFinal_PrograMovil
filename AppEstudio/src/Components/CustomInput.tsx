import React, { useState } from "react";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { KeyboardTypeOptions, StyleSheet, TextInput, TouchableOpacity, View, Text } from "react-native";
import { getFieldError } from "../utils/validators";

type CustomInputProps = {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    type?: "default" | "password" | "email" | "number" | "phone" | "text";
    required?: boolean;
    forceShowError?: boolean;
};

export default function CustomInput({
    placeholder,
  value,
  onChangeText,
  type = "default",
  required = true,
  forceShowError = false,
}: CustomInputProps) {
  const [isSecureText, setIsSecureText] = useState(type === "password");
  const [touched, setTouched] = useState(false);
  const isPasswordField = type === "password";

  const iconName: (typeof MaterialIcons)["name"] | undefined =
    type === "password" ? "lock" :
      type === "email" ? "alternate-email" :
        type === "phone" ? "phone" :
          type === "text" ? "person" : undefined;

  const keyboardType: KeyboardTypeOptions =
    type === "email"
      ? "email-address"
      : type === "number" || type === "phone"
        ? "number-pad"
        : "default";

  const validationType = type === "number" ? "default" : type;
  const errorMessage = getFieldError(validationType as any, value, required);
  const showError = (touched || forceShowError) && !!errorMessage;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputContainer, showError ? styles.inputError : null]}>
        {iconName && <MaterialIcons name={iconName as any} size={20} color="#206291" style={styles.leftIcon} />}
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          onBlur={() => setTouched(true)}
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
      {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginBottom: 12 },
  inputContainer: {
    backgroundColor: '#F0F4F8', flexDirection: 'row', alignItems: 'center',
    borderRadius: 8, borderColor: '#D0D7DE', borderWidth: 1, paddingHorizontal: 12, height: 48,
  },
  leftIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: '#333' },
  inputError: { borderColor: '#D9534F', borderWidth: 1.5 },
  errorText: { color: '#D9534F', fontSize: 12, marginTop: 4, marginLeft: 4 },
});