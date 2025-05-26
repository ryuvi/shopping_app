import React, { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  Switch,
  HelperText,
} from "react-native-paper";
import { Item } from "../../interfaces/Item";
import { fontSizes } from "../Themes/Typography";

const CATEGORIAS = [
  "Higiene Pessoal",
  "Mantimentos",
  "Horti-fruti",
  "Carnes",
  "Limpeza",
  "Outros",
];

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSave: (item: Item) => void;
  item: Item | null;
}

export default function ListaModal({
  visible,
  onDismiss,
  onSave,
  item,
}: Props) {
  const [name, setName] = useState("");
  const [pricePerItem, setPricePerItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isPromotion, setIsPromotion] = useState(false);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setPricePerItem(item.pricePerItem.toString().replace('.', ','));
      setQuantity(item.quantity.toString());
      setIsPromotion(item.isPromotion);
      setCategory(item.category || "");
    } else {
      setName("");
      setPricePerItem("");
      setQuantity("");
      setIsPromotion(false);
      setCategory("");
    }
  }, [item]);

  const handleSubmit = () => {
    const novoItem: Item = {
      id: item?.id || "",
      name,
      pricePerItem: parseFloat(pricePerItem.replace('.', '').replace(',', '.')),
      quantity: parseInt(quantity),
      priceFull: parseFloat(pricePerItem) * parseInt(quantity),
      isPromotion,
      category,
      createdAt: item?.createdAt || new Date().toISOString(),
    };

    onSave(novoItem);
  };

  return (
    <Portal>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Modal
          visible={visible}
          onDismiss={onDismiss}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>
            {item ? "Editar Item" : "Adicionar Item"}
          </Text>

          <TextInput
            label="Nome"
            placeholder="Manga Palmer"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Preço Unitário"
            placeholder="2,99"
            value={pricePerItem}
            onChangeText={setPricePerItem}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Quantidade"
            placeholder="2"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Categoria"
            placeholder="Horti-Fruit"
            value={category}
            onChangeText={setCategory}
            style={styles.input}
            mode="outlined"
          />
          <HelperText type="info">
            Categorias: {CATEGORIAS.join(", ")}
          </HelperText>

          <View style={styles.switchContainer}>
            <Text style={{ fontSize: fontSizes.normal }}>Promoção?</Text>
            <Switch
              value={isPromotion}
              onValueChange={() => setIsPromotion(!isPromotion)}
            />
          </View>

          <Button
            onPress={handleSubmit}
            mode="contained"
            labelStyle={{ fontSize: fontSizes.medium, fontWeight: "bold" }}
            style={{ marginTop: 10 }}
          >
            {item ? "Atualizar" : "Salvar"}
          </Button>
        </Modal>
      </KeyboardAvoidingView>
    </Portal>
  );
}

const styles = StyleSheet.create({
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
});
