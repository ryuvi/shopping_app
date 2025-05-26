// src/screens/DebugStorageScreen.tsx
import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text, Card, Divider } from "react-native-paper";
import { useStorage } from "../context/StorageContext";

export default function DebugStorageScreen() {
  const {
    listaTemporaria,
    listas,
    historicoItems,
    historicoListas,
  } = useStorage();

  const storageData = {
    "lista-temporaria": listaTemporaria,
    "lista-compras": listas,
    "historico-items": historicoItems,
    "historico-listas": historicoListas,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.entries(storageData).map(([key, value]) => (
        <View key={key} style={styles.section}>
          <Text variant="titleMedium" style={styles.title}>
            {key}
          </Text>
          <Card style={styles.card}>
            <Card.Content>
              <Text selectable>{JSON.stringify(value, null, 2)}</Text>
            </Card.Content>
          </Card>
          <Divider style={styles.divider} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#F5F5F5",
    padding: 10,
  },
  divider: {
    marginTop: 16,
  },
});
