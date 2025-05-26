// screens/ListaCompras.tsx
import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { Snackbar, Portal, useTheme } from "react-native-paper";
import { Item } from "../interfaces/Item";
import { useStorage } from "../context/StorageContext";
import ListaHeader from "../components/ListaCompras/ListaHeader";
import ListaItemList from "../components/ListaCompras/ListaItemList";
import ListaModal from "../components/ListaCompras/ListaModal";
import ListaSubtotal from "../components/ListaCompras/ListaSubtotal";
import ListaFAB from "../components/ListaCompras/ListaFAB";
import ConfigModal from "../components/ListaCompras/ConfigModal";

const ListaCompras = () => {
  const {
    listaTemporaria,
    adicionarItemTemporario,
    salvarListaFinal,
    limparTemporaria,
    salvarTemporaria
  } = useStorage();

  const [items, setItems] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [nomeLista, setNomeLista] = useState("Lista do Dia");
  const [limite, setLimite] = useState<number>(500);
  const [configVisible, setConfigVisible] = useState<boolean>(false);

  useEffect(() => {
    setItems(listaTemporaria);
  }, [listaTemporaria]);

  const abrirModal = (item?: Item) => {
    setEditingItem(item || null);
    setModalVisible(true);
  };

  const abrirConfigModal = () => setConfigVisible(true); // 👈 função correta

  const salvarItem = async (item: Item) => {
    const novaLista = editingItem
      ? items.map((i) => (i.id === editingItem.id ? item : i))
      : [...items, item];

    setItems(novaLista);
    if (!editingItem) await adicionarItemTemporario(item);
    setModalVisible(false);
    setEditingItem(null);
  };

  const salvarLista = async () => {
    try {
      await salvarListaFinal({ nome_da_lista: nomeLista, items });
      // await limparTemporaria();
      setSnackbarVisible(true);
    } catch (e) {
      console.error("Erro ao salvar lista final:", e);
    }
  };

  const removerItem = (itemId: string | number) => {
    Alert.alert("Confirmar remoção", "Deseja remover este item?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          const novaLista = items.filter((item) => item.id !== itemId);
          setItems(novaLista);
          try {
            await salvarTemporaria(novaLista); // Atualiza o AsyncStorage e o SQLite
          } catch (error) {
            console.error("Erro ao salvar lista após remoção:", error);
          }
        },
      },
    ]);
  };

  const subtotal = items.reduce((total, item) => total + item.priceFull, 0);

  return (
    <Portal.Host>
    <View style={{ flex: 1 }}>
      <ListaHeader
        title={`Lista - ${new Date().toLocaleDateString("pt-BR")}`}
        onSave={salvarLista}
      />
      <ListaItemList items={items} onEdit={abrirModal} onDelete={removerItem} />
      <ListaModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onSave={salvarItem}
        item={editingItem}
      />
      <ConfigModal
        visible={configVisible}
        onDismiss={() => setConfigVisible(false)}
        limite={limite}
        setLimite={setLimite}
      />
      <ListaFAB
        onPress={() => abrirModal()}
        onConfig={abrirConfigModal} // ✅ Corrigido aqui
      />
      <ListaSubtotal subtotal={subtotal} limite={limite} />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{ label: "OK", onPress: () => {} }}
      >
        Lista salva com sucesso!
      </Snackbar>
    </View>
    </Portal.Host>
  );
};

export default ListaCompras;
