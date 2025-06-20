import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions, Alert } from "react-native";
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  Switch,
  HelperText,
  useTheme,
} from "react-native-paper";
import { Itens } from "@db/schema";
import { fontSizes } from "../../shared/ui/Typography";

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
  onSave: (item: Itens) => void;
  item: Itens | null;
}

const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function ListaModal({ visible, onDismiss, onSave, item }: Props) {
  const { colors } = useTheme();

  const [name, setName] = useState("");
  const [pricePerItem, setPricePerItem] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [isPromotion, setIsPromotion] = useState(false);
  const [category, setCategory] = useState("");
  const [peso, setPeso] = useState("1");

  useEffect(() => {
    if (item) {
      setName(item.nome);
      setPricePerItem(item.price.toString().replace(".", ","));
      setQuantity(item.quantity.toString());
      setIsPromotion(item.isPromocao === 1);
      setCategory(item.category || "");
      setPeso(item.peso?.toString().replace(".", ",") || "1");
    } else {
      setName("");
      setPricePerItem("");
      setQuantity("1");
      setIsPromotion(false);
      setCategory("");
      setPeso("1");
    }
  }, [item]);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Erro', "O nome do item é obrigatório");
      return;
    }

    if (!pricePerItem || isNaN(parseFloat(pricePerItem.replace(',', '.')))) {
      Alert.alert('Erro', "Preço inválido");
      return;
    }

    const formatNumber = (value: string) => {
      if (value.includes(','))
        return parseFloat(value.replace('.', '').replace(',', '.'))
      return parseFloat(value)
    }

    const novoItem: Itens = {
      id: item?.id || "",
      nome: normalizeText(name),
      price: formatNumber(pricePerItem) || 0,
      quantity: parseInt(quantity) || 1,
      isPromocao: isPromotion ? 1 : 0,
      category: normalizeText(category),
      peso: formatNumber(peso) || 1,
      createdAt: item?.createdAt || new Date().toISOString(),
    };

    onSave(novoItem);
  };

  const { width, height } = Dimensions.get("window");

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          {
            backgroundColor: colors.surface,
            width: width * 0.9,
            maxHeight: height * 0.8,
            alignSelf: 'center',
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Text style={[styles.modalTitle, { color: colors.onSurface }]}>
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
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TextInput
              label="Quantidade"
              placeholder="2"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={[styles.input, { flex: 1, marginRight: 5 }]}
              mode="outlined"
            />
            <TextInput
              label="Peso (kg)"
              placeholder="0,300"
              value={peso}
              onChangeText={setPeso}
              keyboardType="numeric"
              style={[styles.input, { flex: 1, marginLeft: 5 }]}
              mode="outlined"
            />
          </View>
          <TextInput
            label="Categoria"
            placeholder="Horti-fruti"
            value={category}
            onChangeText={setCategory}
            style={styles.input}
            mode="outlined"
          />
          <HelperText type="info" style={{ color: colors.onSurfaceVariant }}>
            Categorias: {CATEGORIAS.join(", ")}
          </HelperText>

          <View style={styles.switchContainer}>
            <Text style={{ fontSize: fontSizes.normal, color: colors.onSurface }}>
              Promoção?
            </Text>
            <Switch
              value={isPromotion}
              onValueChange={() => setIsPromotion(!isPromotion)}
              color={colors.primary}
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
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 16,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    alignSelf: "center",
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
