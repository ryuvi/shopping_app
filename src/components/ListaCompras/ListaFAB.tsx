import React from "react";
import { useWindowDimensions, View } from "react-native";
import { Portal, FAB } from "react-native-paper";

export default function ListaFAB({
  onPress,
  onConfig,
}: {
  onPress: () => void;
  onConfig: () => void;
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
  ];

  return (
    <Portal>
      {/* <View style={{ position: "absolute", right: 16, bottom: 72 }}> */}
        <FAB.Group
          visible={true}
          open={isOpen}
          icon={isOpen ? "close" : "plus"}
          actions={actions}
          onStateChange={({ open }) => setIsOpen(open)}
          // fabStyle={{
          //   position: 'absolute',
          //   right: 16,
          //   bottom: 150
          // }}
          style={{
            position: 'absolute',
            // right: 8,
            // bottom: 150,
            height,
            width,
            paddingBottom: 175
          }}
        />
      {/* </View> */}
    </Portal>
  );
}

