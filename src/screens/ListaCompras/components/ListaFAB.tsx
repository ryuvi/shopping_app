// ListaFAB.tsx

import React from "react";
import { useWindowDimensions, View } from "react-native";
import { Portal, FAB } from "react-native-paper";

export default function ListaFAB({
  onPress,
  onConfig,
  onSave,
}: {
  onPress: () => void;
  onConfig: () => void;
  onSave: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const height = useWindowDimensions().height
  const width = useWindowDimensions().width

  const actions = [
    {
      icon: "plus",
      onPress: onPress,
      label: 'Adicionar item',
      accessibilityLabel: "Adicionar um item a lista",
    },
    {
      icon: "cog",
      onPress: onConfig,
      label: "Configurações",
      small: false,
      accessibilityLabel: "Configurar limite de gastos",
    },
    {
      icon: 'content-save',
      onPress: onSave,
      label: "Salvar Lista",
      accessibilityLabel: "Salvar a lista atual",
    }
  ];

  return (
    <Portal>
        <FAB.Group
          visible={true}
          open={isOpen}
          icon={isOpen ? "close" : "plus"}
          actions={actions}
          onStateChange={({ open }) => setIsOpen(open)}
          style={{
            position: 'absolute',
            height,
            width,
            paddingBottom: '35%'
          }}
        />
    </Portal>
  );
}

