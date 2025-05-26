import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";
import { Item } from "../../interfaces/Item";

interface Props {
  item: { nome_da_lista: string; items: Item[] };
  onPress: () => void;
}

const ListaCard = ({ item, onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">{item.nome_da_lista}</Text>
        <Text>Itens: {item.items.length}</Text>
      </Card.Content>
    </Card>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
});

export default ListaCard;
