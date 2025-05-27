import { View, Alert } from "react-native";
import { ActivityIndicator, Portal, useTheme } from "react-native-paper";
import Header from "@shared/components/Header";
import { useDespensa } from "./hooks/useDespensa";
import { useState } from "react";
import DespensaLista from "./components/DespensaLista";
import FormularioDespensaModal from "./components/FormularioDespensaModal";
import FABAdicionarItem from "./components/FABAdicionarItem";

export default function Despensa() {
  const { items, loading, addItem, toggleItemStatus } = useDespensa();
  const { colors } = useTheme();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    peso: "",
    category: "",
    isAberto: false,
  });

  const handleToggleAccordion = (category: string) => {
    setExpanded((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
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
        isAberto: form.isAberto,
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

        <DespensaLista
          items={items}
          expanded={expanded}
          onToggleAccordion={handleToggleAccordion}
          onToggleStatus={toggleItemStatus}
        />

        <FormularioDespensaModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          form={form}
          setForm={setForm}
          onSubmit={handleAddItem}
        />

        <FABAdicionarItem onPress={() => setModalVisible(true)} />
      </View>
    </Portal.Host>
  );
}
