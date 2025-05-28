// Despensa.tsx
import { View, Alert } from "react-native";
import { ActivityIndicator, Portal, useTheme } from "react-native-paper";
import Header from "@shared/components/Header";
import { useDespensa } from "./hooks/useDespensa";
import { useState } from "react";
import DespensaLista from "./components/DespensaLista";
import FormularioDespensaModal from "./components/FormularioDespensaModal";
import FABAdicionarItem from "./components/FABAdicionarItem";
import FilterHeader from "./components/FilterHeader";

export default function Despensa() {
  const { items, loading, addItem, removeItem, getItemById, updateItem } =
    useDespensa();
  const { colors } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    peso: "",
    category: "",
    isAberto: false,
  });
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleEditItem = async (id: string) => {
    const item = await getItemById(id);

    if (item) {
      setForm({
        name: item.name,
        quantity: item.quantity.toString(),
        peso: item.peso.toString(),
        category: item.category,
        isAberto: item.isAberto === 1,
      });
      setEditingItemId(id);
      setModalVisible(true);
    }
  };

  const handleSubmit = async () => {
    const itemData = {
      name: form.name,
      quantity: Number(form.quantity),
      peso: Number(form.peso),
      category: form.category,
      isAberto: form.isAberto ? 1 : 0,
    };
    try {
      if (editingItemId) {
        await updateItem(editingItemId, itemData);
      } else {
        await addItem(itemData);
      }

      setModalVisible(false);
      setForm({
        name: "",
        quantity: "",
        peso: "",
        category: "",
        isAberto: false,
      });
      setEditingItemId(null);
    } catch (e) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar o item.");
    }
  };

  const handleAddItem = async () => {
    try {
      if (!form.name || !form.quantity || !form.category) {
        Alert.alert("Preencha todos os campos");
        return;
      }

      await addItem({
        name: form.name,
        quantity: parseInt(form.quantity),
        peso: parseFloat(form.peso),
        category: form.category,
        isAberto: form.isAberto ? 1 : 0,
      });

      setModalVisible(false);
      setForm({
        name: "",
        quantity: "",
        peso: "",
        category: "",
        isAberto: false,
      });
    } catch (error) {
      Alert.alert("Erro ao adicionar item");
    }
  };

  if (loading && items.length === 0) {
    return <ActivityIndicator animating={true} color={colors.primary} />;
  }

  return (
    <Portal.Host>
      <View style={{ flex: 1 }}>
        <Header title="Despensa" />
        <FilterHeader
          items={items}
          filtroCategoria={filtroCategoria}
          setFiltroCategoria={setFiltroCategoria}
        />
        <DespensaLista
          items={
            filtroCategoria
              ? items.filter((item) => item.category === filtroCategoria)
              : items
          }
          handleEditItem={handleEditItem}
        />

        <FormularioDespensaModal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            setEditingItemId(null);
            setForm({
              name: "",
              quantity: "",
              peso: "",
              category: "",
              isAberto: false,
            });
          }}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onDelete={async () => {
            if (editingItemId) {
              Alert.alert(
                "Confirmar exclusão",
                "Tem certeza que deseja remover este item?",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Remover",
                    style: "destructive",
                    onPress: async () => {
                      await removeItem(editingItemId);
                      setModalVisible(false);
                      setEditingItemId(null);
                      setForm({
                        name: "",
                        quantity: "",
                        peso: "",
                        category: "",
                        isAberto: false,
                      });
                    },
                  },
                ]
              );
            }
          }}
          isEditing={!!editingItemId}
        />

        <FABAdicionarItem onPress={() => setModalVisible(true)} />
      </View>
    </Portal.Host>
  );
}
