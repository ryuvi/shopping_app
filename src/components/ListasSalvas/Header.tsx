import React from "react";
import { Appbar } from "react-native-paper";

const Header = () => (
  <Appbar.Header elevated>
    <Appbar.Content titleStyle={{ fontWeight: "bold" }} title="Listas Salvas" />
  </Appbar.Header>
);

export default Header;
