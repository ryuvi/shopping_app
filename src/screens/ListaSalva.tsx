import React, { useState } from "react";
import { View, FlatList } from "react-native";
import { Divider } from "react-native-paper";
import { useStorage } from "../context/StorageContext";
import Header from "../components/ListasSalvas/Header";
import ListaCard from "../components/ListasSalvas/ListaCard";
import ListaVazia from "../components/ListasSalvas/ListaVazia";
import ListaDetalhesModal from "../components/ListasSalvas/ListaDetalhesModal";
import { Item } from "../interfaces/Item";

const ListasSalvas = () => {
  const { listas } = useStorage();
  const [modalVisible, setModalVisible] = useState(false);
  const [listaSelecionada, setListaSelecionada] = useState<{
    nome_da_lista: string;
    items: Item[];
  } | null>(null);

  const abrirModal = (lista: { nome_da_lista: string; items: Item[] }) => {
    setListaSelecionada(lista);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      {listas.length === 0 ? (
        <ListaVazia />
      ) : (
        <FlatList
          data={listas}
          keyExtractor={(item) => item.nome_da_lista}
          renderItem={({ item }) => (
            <ListaCard item={item} onPress={() => abrirModal(item)} />
          )}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={{ padding: 8 }}
        />
      )}
      <ListaDetalhesModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        lista={listaSelecionada}
      />
    </View>
  );
};

export default ListasSalvas;
