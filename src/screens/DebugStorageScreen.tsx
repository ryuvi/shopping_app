// src/screens/DebugStorageScreen.tsx

import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text, Card, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DebugStorageScreen() {
  const [storageData, setStorageData] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchStorage = async () => {
      const keys = ["lista-compras", "historico-items"];
      const data: Record<string, any> = {};

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        data[key] = value ? JSON.parse(value) : null;
      }

      setStorageData(data);
    };

    fetchStorage();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.entries(storageData).map(([key, value]) => (
        <View key={key} style={styles.section}>
          <Text variant="titleMedium" style={styles.title}>{key}</Text>
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
