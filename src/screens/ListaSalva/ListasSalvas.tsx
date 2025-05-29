import { View, FlatList } from "react-native";
import { Divider } from "react-native-paper";
import useListasSalvas from "./hooks/useListasSalvas";
import ListaCard from "./components/ListaCard";
import ListaVazia from "./components/ListaVazia";
import ListaDetalhesModal from "./components/ListaDetalhesModal";
import Header from "@shared/components/Header";

export default function ListasSalvas() {
  const {
    listasComItens,
    modalVisible,
    listaSelecionada,
    abrirModal,
    fecharModal,
  } = useListasSalvas();

  return (
    <View style={{ flex: 1 }}>
      <Header title="Listas Salvas" />
      {listasComItens.length === 0 ? (
        <ListaVazia />
      ) : (
        <FlatList
          data={listasComItens}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListaCard item={item} onPress={() => abrirModal(item)} />}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={{ padding: 8 }}
          numColumns={2}
        />
      )}
      <ListaDetalhesModal
        visible={modalVisible}
        onDismiss={fecharModal}
        lista={listaSelecionada}
      />
    </View>
  );
}