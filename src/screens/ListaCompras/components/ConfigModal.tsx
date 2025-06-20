// ConfigModal.tsx

import { useConfig } from "@shared/hooks/useConfigStore";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Modal, Portal, Text, TextInput, Button } from "react-native-paper";

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export default function ConfigModal({ visible, onDismiss }: Props) {
  const { setLimite, limite } = useConfig();

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
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button onPress={onDismiss} mode="outlined" style={{ marginTop: 10 }}>
            Cancelar
          </Button>
          <Button onPress={onDismiss} mode="contained" style={{ marginTop: 10, marginLeft: 10 }}>
            Salvar
          </Button>
        </View>
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
