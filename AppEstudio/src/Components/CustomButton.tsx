import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "tertiary";
};

export default function CustomButton({ title, onPress, variant = 'primary' }: CustomButtonProps) {
  const styles = getStyles(variant);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

const getStyles = (variant: "primary" | "secondary" | "tertiary") =>
  StyleSheet.create({
    button: {
      backgroundColor:
        variant === "primary" ? '#206291' :
          variant === "secondary" ? '#C5DEF0' : 'transparent',
      borderRadius: 8,
      width: '100%',
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      borderWidth: variant === "tertiary" ? 1 : 0,
      borderColor: '#206291',
    },
    buttonTitle: {
      color: variant === "primary" ? '#FFFFFF' : '#206291',
      fontSize: 16,
      fontWeight: '600',
    },
  });