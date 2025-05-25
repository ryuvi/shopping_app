import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import ListaCompras from "./screens/ListaCompras";
import ListasSalvas from "./screens/ListaSalva";
import GraficoHistorico from "./screens/Graficos";

const Navigation = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
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
      key: "graphics",
      title: "Gráficos",
      focusedIcon: 'chart-line',
      unfocusedIcon: 'chart-line',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    compras: () => <ListaCompras />,
    recents: () => <ListasSalvas />,
    graphics: () => <GraficoHistorico />,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{ backgroundColor: "#C8E6C9" }}
    />
  );
};

export default Navigation;
