// ListaCompras.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, Animated } from "react-native";
import {
  Appbar,
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  Switch,
  AnimatedFAB,
  Snackbar,
  HelperText,
} from "react-native-paper";
import { Item } from "../interfaces/Item";
import ItemCard from "../components/ItemCard";
import { useStorage } from "../context/StorageContext";

const CATEGORIAS = [
  "Higiene Pessoal",
  "Mantimentos",
  "Horti-fruti",
  "Carnes",
  "Limpeza",
  "Outros",
];

function ListaCompras() {
  const {
    listaTemporaria,
    adicionarItemTemporario,
    salvarListaFinal,
    limparTemporaria,
  } = useStorage();

  const [items, setItems] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Formulário
  const [name, setName] = useState("");
  const [pricePerItem, setPricePerItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isPromotion, setIsPromotion] = useState(false);
  const [category, setCategory] = useState("");

  const [nomeLista, setNomeLista] = useState("Lista do Dia");
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    setItems(listaTemporaria);
  }, [listaTemporaria]);

  const abrirModal = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setName(item.name);
      setPricePerItem(item.pricePerItem.toString());
      setQuantity(item.quantity.toString());
      setIsPromotion(item.isPromotion);
      setCategory(item.category || "");
    } else {
      setEditingItem(null);
      setName("");
      setPricePerItem("");
      setQuantity("");
      setIsPromotion(false);
      setCategory("");
    }
    setModalVisible(true);
  };

  const salvarItem = async () => {
    const novoItem: Item = {
      id: editingItem ? editingItem.id : "",
      name,
      pricePerItem: parseFloat(pricePerItem),
      quantity: parseInt(quantity),
      priceFull: parseFloat(pricePerItem) * parseInt(quantity),
      isPromotion,
      category,
      createdAt: new Date().toISOString(),
    };

    const novaLista = editingItem
      ? items.map((i) => (i.id === editingItem.id ? novoItem : i))
      : [...items, novoItem];

    setItems(novaLista);

    if (!editingItem) {
      await adicionarItemTemporario(novoItem);
    }

    setModalVisible(false);
    setEditingItem(null);
    setName("");
    setPricePerItem("");
    setQuantity("");
    setIsPromotion(false);
    setCategory("");
  };

  const salvarLista = async () => {
    try {
      const lista = {
        nome_da_lista: nomeLista,
        items,
        criadaEm: new Date().toISOString(),
      };

      await salvarListaFinal(lista);
      await limparTemporaria();
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
        onPress: () => {
          const nova = items.filter((item) => item.id !== itemId);
          setItems(nova);
        },
      },
    ]);
  };

  const dataHoje = new Date().toLocaleDateString("pt-BR");
  const subtotal = items.reduce((total, item) => total + item.priceFull, 0);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header elevated style={{ backgroundColor: "#C8E6C9" }}>
        <Appbar.Content title={`Lista - ${dataHoje}`} />
        <Appbar.Action icon="content-save" onPress={salvarLista} />
      </Appbar.Header>

      <Animated.FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onEdit={() => abrirModal(item)}
            onDelete={() => removerItem(item.id)}
          />
        )}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>
            {editingItem ? "Editar Item" : "Adicionar Item"}
          </Text>

          <TextInput
            label="Nome"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Ex: Shampoo"
            mode="outlined"
          />
          <TextInput
            label="Preço Unitário"
            value={pricePerItem}
            onChangeText={setPricePerItem}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            placeholder="Ex: 5.99"
          />
          <TextInput
            label="Quantidade"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            placeholder="Ex: 2"
          />
          <TextInput
            label="Categoria"
            value={category}
            onChangeText={setCategory}
            style={styles.input}
            placeholder="Ex: Higiene Pessoal"
            mode="outlined"
          />
          <HelperText type="info">
            Categorias: {CATEGORIAS.join(", ")}
          </HelperText>

          <View style={styles.switchContainer}>
            <Text>Promoção?</Text>
            <Switch
              value={isPromotion}
              onValueChange={() => setIsPromotion(!isPromotion)}
            />
          </View>
          <Button onPress={salvarItem} mode="contained" style={{ marginTop: 10 }}>
            {editingItem ? "Atualizar" : "Salvar"}
          </Button>
        </Modal>
      </Portal>

      <AnimatedFAB
        icon="plus"
        onPress={() => abrirModal()}
        label="Adicionar"
        extended={false}
        animateFrom="right"
        style={styles.fab}
      />

      <View style={styles.subtotalContainer}>
        <Text style={styles.subtotalText}>
          Subtotal: R$ {subtotal.toFixed(2)}
        </Text>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{ label: "OK", onPress: () => {} }}
      >
        Lista salva com sucesso!
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 16,
    bottom: 72,
    backgroundColor: "#AED581",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  subtotalContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#DCEDC8",
    alignItems: "flex-end",
  },
  subtotalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ListaCompras;
