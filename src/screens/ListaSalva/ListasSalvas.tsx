import { View, FlatList, Dimensions, StyleSheet } from "react-native";
import useListasSalvas from "./hooks/useListasSalvas";
import ListaCard from "./components/ListaCard";
import ListaVazia from "./components/ListaVazia";
import ListaDetalhesModal from "./components/ListaDetalhesModal";
import Header from "@shared/components/Header";
import { Portal } from "react-native-paper";

export default function ListasSalvas() {
  const {
    listasComItens,
    modalVisible,
    listaSelecionada,
    abrirModal,
    fecharModal,
  } = useListasSalvas();

  const numColumns = 2;
  const screenWidth = Dimensions.get("window").width;
  const cardSpacing = 16;
  const cardWidth = (screenWidth - cardSpacing * (numColumns + 1)) / numColumns;

  return (
    <Portal.Host>
    <View style={{ flex: 1 }}>
      <Header title="Listas Salvas" />

      {listasComItens.length === 0 ? (
        <ListaVazia />
      ) : (
        <FlatList
          data={listasComItens}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          renderItem={({ item }) => (
            <View style={[styles.cardContainer, { width: cardWidth }]}>
              <ListaCard item={item} onPress={() => abrirModal(item)} />
            </View>
          )}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <ListaDetalhesModal
        visible={modalVisible}
        onDismiss={fecharModal}
        lista={listaSelecionada}
      />
    </View>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
});
