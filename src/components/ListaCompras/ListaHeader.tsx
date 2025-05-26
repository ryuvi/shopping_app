import React from "react";
import { Appbar } from "react-native-paper";

export default function ListaHeader({ title, onSave }: { title: string; onSave: () => void }) {
  return (
    <Appbar.Header elevated 
      // style={{ backgroundColor: "#C8E6C9" }}
      >
      <Appbar.Content  titleStyle={{ fontWeight: "bold" }} title={title} />
      <Appbar.Action icon="content-save" onPress={onSave} />
    </Appbar.Header>
  );
}
