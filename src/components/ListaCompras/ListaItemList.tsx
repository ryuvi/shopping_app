import React from "react";
import { Animated } from "react-native";
import ItemCard from "../ItemCard";
import { Item } from "../../interfaces/Item";

interface Props {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string | number) => void;
}

export default function ListaItemList({ items, onEdit, onDelete }: Props) {
  return (
    <Animated.FlatList
      data={items}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ItemCard item={item} onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} />
      )}
    />
  );
}
