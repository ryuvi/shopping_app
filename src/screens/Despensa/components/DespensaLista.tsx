// DespensaLista.tsx
import { Animated, View } from "react-native";
import { Card, Chip, Text, useTheme } from "react-native-paper";
import { DespensaItem } from "../hooks/useDespensa";
import { fontSizes } from "@/screens/shared/ui/Typography";

interface Props {
  items: DespensaItem[];
  handleEditItem: (id: string) => void;
}


export default function DespensaLista({
  items,
  handleEditItem,
}: Props) {

  const {colors} = useTheme()

  return (
    <Animated.FlatList
      data={items}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 12 }}
      renderItem={({ item }) => (
        <Card
          style={{ marginBottom: 10 }}
          onPress={() => handleEditItem(item.id)}
        >
          <Card.Content>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: fontSizes.medium, fontWeight: "bold" }}>
              {item.name} - {item.quantity}x{item.peso ? ` - ${item.peso}kg` : ""}
            </Text>
            <Chip  mode="flat">{item.category}</Chip>
            </View>
            <Text style={{ fontSize: fontSizes.normal, color: "#666" }}>
              {item.isAberto ? "Aberto" : "Fechado"}
            </Text>
          </Card.Content>
        </Card>
      )}
    />
  );
}
