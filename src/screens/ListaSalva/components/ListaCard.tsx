import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";
import { Itens } from "../../../db/schema";

interface Props {
  item: { nome: string; items: Itens[] };
  onPress: () => void;
}

const ListaCard = ({ item, onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">{item.nome}</Text>
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
