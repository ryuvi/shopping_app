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
  PaperProvider,
  Switch,
  AnimatedFAB,
  Snackbar,
  HelperText,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Item from "../interfaces/Item";
import ItemCard from "../components/ItemCard";

const CATEGORIAS = [
  "Higiene Pessoal",
  "Mantimentos",
  "Horti-fruti",
  "Carnes",
  "Limpeza",
  "Outros",
];

function ListaCompras() {
  const [items, setItems] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Formulário
  const [name, setName] = useState("");
  const [pricePerItem, setPricePerItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isPromotion, setIsPromotion] = useState(false);
  const [category, setCategory] = useState("");

  const [nomeLista, setNomeLista] = useState("")

  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const salvarLista = async () => {
    try {
      const novaLista = {
        nome_da_lista: nomeLista,
        items
      }

      const dados = await AsyncStorage.getItem("lista-compras");
      let listas = dados ? JSON.parse(dados) : [];

      const indexExistente = listas.findIndex((l: any) => l.nome_da_lista === nomeLista);
      if (indexExistente !== -1) {
        listas[indexExistente] = novaLista;
      } else {
        listas.push(novaLista);
      }

      await AsyncStorage.setItem("lista-compras", JSON.stringify(listas));
      setSnackbarVisible(true);
    } catch (e) {
      console.error("Erro ao salvar lista:", e);
    }
  };

  const carregarLista = async () => {
    try {
      const dados = await AsyncStorage.getItem("lista-compras");
      if (dados) {
        const listas = JSON.parse(dados);
        if (listas.length > 0) {
          setNomeLista(listas[0].nome_da_lista);
          setItems(listas[0].items);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar lista:", e);
    }
  };

  useEffect(() => {
    carregarLista(); // Carrega ao montar
  }, []);

  useEffect(() => {
  const salvarAuto = async () => {
    const novaLista = {
      nome_da_lista: nomeLista,
      items
    };

    const dados = await AsyncStorage.getItem("lista-compras");
    let listas = dados ? JSON.parse(dados) : [];

    const indexExistente = listas.findIndex((l: any) => l.nome_da_lista === nomeLista);
    if (indexExistente !== -1) {
      listas[indexExistente] = novaLista;
    } else {
      listas.push(novaLista);
    }

    await AsyncStorage.setItem("lista-compras", JSON.stringify(listas));
  };

  if (nomeLista) salvarAuto();
}, [items, nomeLista]);


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
      id: editingItem ? editingItem.id : Date.now(),
      name,
      pricePerItem: parseFloat(pricePerItem),
      quantity: parseInt(quantity),
      priceFull: parseFloat(pricePerItem) * parseInt(quantity),
      isPromotion,
      category,
    };

    const novaLista = editingItem
      ? items.map((i) => (i.id === editingItem.id ? novoItem : i))
      : [...items, novoItem];

    setItems(novaLista);
    setModalVisible(false);
    setEditingItem(null);
    setName("");
    setPricePerItem("");
    setQuantity("");
    setIsPromotion(false);
    setCategory("");

    // Salvar histórico
    const historicoAtual = await AsyncStorage.getItem("historico-items");
    const historico = historicoAtual ? JSON.parse(historicoAtual) : {};
    if (!historico[novoItem.name]) historico[novoItem.name] = [];
    historico[novoItem.name].push(novoItem.pricePerItem);
    await AsyncStorage.setItem("historico-items", JSON.stringify(historico));
  };

  const removerItem = (itemId: number) => {
    Alert.alert("Confirmar remoção", "Deseja remover este item?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => {
          setItems(items.filter((item) => item.id !== itemId));
        },
      },
    ]);
  };

  const dataHoje = new Date().toLocaleDateString("pt-BR");
  const subtotal = items.reduce((total, item) => total + item.priceFull, 0);

  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        <Appbar.Header elevated={true} style={{ backgroundColor: '#C8E6C9' }}>
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
            <HelperText type="info">Categorias: {CATEGORIAS.join(", ")}</HelperText>

            <View style={styles.switchContainer}>
              <Text>Promoção?</Text>
              <Switch
                value={isPromotion}
                onValueChange={() => setIsPromotion(!isPromotion)}
              />
            </View>
            <Button
              onPress={salvarItem}
              mode="contained"
              style={{ marginTop: 10 }}
            >
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
    </PaperProvider>
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
