// Navigation.tsx
import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import ListaCompras from "./screens/ListaCompras";
import ListasSalvas from "./screens/ListaSalva";
// import DebugStorageScreen from "./screens/DebugStorageScreen";
// import GraficoHistorico from "./screens/Graficos"; // ativar quando for usar
import { StorageProvider } from "./context/StorageContext";

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
    // {
    //   key: "debug",
    //   title: "Storage",
    //   focusedIcon: "database",
    //   unfocusedIcon: "database-outline",
    // },
    // {
    //   key: "graphics",
    //   title: "Gráficos",
    //   focusedIcon: "chart-line",
    //   unfocusedIcon: "chart-line",
    // },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    compras: () => <ListaCompras />,
    recents: () => <ListasSalvas />,
    // debug: () => <DebugStorageScreen />,
    // graphics: () => <GraficoHistorico />,
  });

  return (
    <StorageProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        // barStyle={{ backgroundColor: "#C8E6C9" }}
      />
    </StorageProvider>
  );
};

export default Navigation;
