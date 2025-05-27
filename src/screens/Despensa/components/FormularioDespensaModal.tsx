import { View, StyleSheet, Alert } from "react-native";
import { Modal, TextInput, Checkbox, Button, Text, Portal } from "react-native-paper";
import { fontSizes } from "../../shared/ui/Typography";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  form: any;
  setForm: (form: any) => void;
  onSubmit: () => void;
}

export default function FormularioDespensaModal({
  visible,
  onDismiss,
  form,
  setForm,
  onSubmit,
}: Props) {
  return (
    <Portal>
    <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
      <Text style={{ fontSize: fontSizes.large }}>Adicionar item</Text>

      <TextInput
        label="Nome"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
        style={styles.input}
        mode="outlined"
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TextInput
          label="Quantidade"
          value={form.quantity}
          onChangeText={(text) => setForm({ ...form, quantity: text })}
          keyboardType="numeric"
          style={[styles.input, { marginRight: 5, flex: 1 }]}
          mode="outlined"
        />
        <TextInput
          label="Peso (kg)"
          value={form.peso}
          onChangeText={(text) => setForm({ ...form, peso: text })}
          keyboardType="numeric"
          style={[styles.input, { marginLeft: 5, flex: 1 }]}
          mode="outlined"
        />
      </View>

      <TextInput
        label="Categoria"
        value={form.category}
        onChangeText={(text) => setForm({ ...form, category: text })}
        style={styles.input}
        mode="outlined"
      />

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Checkbox
          status={form.isAberto ? "checked" : "unchecked"}
          onPress={() => setForm({ ...form, isAberto: !form.isAberto })}
        />
        <Text style={{ fontSize: fontSizes.normal }}>Está aberto?</Text>
      </View>

      <Button mode="contained" onPress={onSubmit}>
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
    margin: 16,
    borderRadius: 8,
  },
  input: {
    marginBottom: 12,
  },
});
