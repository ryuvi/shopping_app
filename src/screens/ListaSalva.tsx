import React from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Appbar, Card, Text, Divider } from "react-native-paper";
import { useStorage } from "../context/StorageContext";
import { Item } from "../interfaces/Item";

const ListasSalvas = ({ navigation }: any) => {
  const { listas } = useStorage();

  const renderItem = ({ item }: { item: { nome_da_lista: string; items: Item[] } }) => (
    <TouchableOpacity onPress={() => navigation.navigate("ListaCompras", { lista: item })}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">{item.nome_da_lista}</Text>
          <Text>Itens: {item.items.length}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: "#C8E6C9" }}>
        <Appbar.Content title="Listas Salvas" />
      </Appbar.Header>

      {listas.length === 0 ? (
        <View style={styles.empty}>
          <Text>Nenhuma lista salva ainda.</Text>
        </View>
      ) : (
        <FlatList
          data={listas}
          keyExtractor={(item) => item.nome_da_lista}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={{ padding: 8 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  empty: {
    padding: 20,
    alignItems: "center",
  },
});

export default ListasSalvas;
