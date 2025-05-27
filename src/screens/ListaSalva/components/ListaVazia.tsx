import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const ListaVazia = () => (
  <View style={styles.empty}>
    <Text>Nenhuma lista salva ainda.</Text>
  </View>
);

const styles = StyleSheet.create({
  empty: {
    padding: 20,
    alignItems: "center",
  },
});

export default ListaVazia;
