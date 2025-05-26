import React from "react";
import { StyleSheet } from "react-native";
import { Modal, Portal, Text, TextInput, Button } from "react-native-paper";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  limite: number | null;
  setLimite: (value: number) => void;
}

export default function ConfigModal({ visible, onDismiss, limite, setLimite }: Props) {
  const handleChange = (text: string) => {
    const parsed = parseFloat(text.replace(",", "."));
    if (!isNaN(parsed)) {
      setLimite(parsed);
    }
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <Text style={styles.title}>Definir limite de gastos</Text>
        <TextInput
          label="Limite (R$)"
          keyboardType="numeric"
          value={limite !== null ? limite.toString() : ""}
          onChangeText={handleChange}
          mode="outlined"
        />
        <Button onPress={onDismiss} mode="contained" style={{ marginTop: 10 }}>
          Salvar
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
});
