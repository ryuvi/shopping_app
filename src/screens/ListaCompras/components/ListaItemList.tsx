// ListaItemList.tsx

import React from "react";
import { Animated } from "react-native";
import ItemCard from "../../shared/components/ItemCard";
import { Itens } from "../../../db/schema";

interface Props {
  items: Itens[];
  onEdit: (item?: Itens) => void;
  onDelete: (id: string ) => void;
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
