import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

type CustomCardProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
};

export default function CustomCard({ title, subtitle, children, style }: CustomCardProps) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%", backgroundColor: "#F0F4F8", borderRadius: 12, padding: 18,
    marginBottom: 16, borderWidth: 1, borderColor: "#D0D7DE",
  },
  title: { fontSize: 18, fontWeight: "700", color: "#206291", marginBottom: 4 },
  subtitle: { fontSize: 13, color: "#555" },
});