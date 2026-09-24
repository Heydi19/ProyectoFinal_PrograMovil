import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { MainTabParamList } from "../navigation/MainTabs";
import type { RootStackParamList } from "../navigation/RootNavigator";
import CustomCard from "../Components/CustomCard";
import CustomButton from "../Components/CustomButton";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Profile">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function ProfileScreen({ navigation }: Props) {
  const handleLogout = () => {
    (navigation.getParent() as any)?.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Perfil</Text>

        <CustomCard title="Usuario" subtitle="usuario@appestudio.com" />

        <CustomButton title="Cerrar sesión" onPress={handleLogout} variant="secondary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#206291", marginBottom: 20 },
});