import React from "react";
import { Appbar } from "react-native-paper";

export default function Header({
  title,
}: {
  title: string;
}) {
  return (
    <Appbar.Header elevated>
      <Appbar.Content titleStyle={{ fontWeight: "bold" }} title={title} />
    </Appbar.Header>
  );
}
