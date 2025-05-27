import React, { useEffect, useState } from "react";
import { Dialog, Portal, TextInput, Button, Text } from "react-native-paper";

interface SaveListDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (listName: string) => void;
  initialListName?: string;
}

const SaveListDialog: React.FC<SaveListDialogProps> = ({
  visible,
  onDismiss,
  onSave,
  initialListName = "",
}) => {
  const [listName, setListName] = useState(initialListName);
  const [error, setError] = useState("");

  // Reset para o nome inicial quando o dialog reabrir
  useEffect(() => {
    if (visible) {
      setListName(initialListName);
      setError("");
    }
  }, [visible, initialListName]);

  const handleSave = () => {
    if (!listName.trim()) {
      setError("O nome da lista é obrigatório");
      return;
    }
    setError("");
    onSave(listName);
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Salvar Lista</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Nome da lista"
            value={listName}
            onChangeText={setListName}
            mode="outlined"
            autoFocus
            error={!!error}
          />
          {error && <Text style={{ color: "red", marginTop: 8 }}>{error}</Text>}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button mode="contained" onPress={handleSave}>
            Salvar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default SaveListDialog;
