// Navigation.tsx
import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import ListaCompras from "./screens/ListaCompras/ListaCompras";
import ListasSalvas from "./screens/ListaSalva/ListasSalvas";
import Despensa from "./screens/Despensa/Despensa";
// import DebugStorageScreen from "./screens/DebugStorageScreen";
// import GraficoHistorico from "./screens/Graficos"; // ativar quando for usar

const Navigation = () => {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {
      key: "compras",
      title: "Lista de Compras",
      focusedIcon: "list-box",
      unfocusedIcon: "list-box-outline",
    },
    {
      key: "recents",
      title: "Recentes",
      focusedIcon: "history",
      unfocusedIcon: "history",
    },
    {
      key: "store",
      title: "Despensa",
      focusedIcon: "archive",
      unfocusedIcon: "archive-outline",
    }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    compras: () => <ListaCompras />,
    recents: () => <ListasSalvas />,
    store: () => <Despensa />,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default Navigation;
