import { View, Animated } from "react-native";
import { DespensaItem } from "../hooks/useDespensa";
import { Chip, Text } from "react-native-paper";
import { fontSizes } from "@/screens/shared/ui/Typography";

interface Props {
  items: DespensaItem[];
  filtroCategoria: string | null;
  setFiltroCategoria: (categoria: string | null) => void;
}

export default function FilterHeader({ items, filtroCategoria, setFiltroCategoria }: Props) {
  const uniqueCategories = Array.from(new Set(items.map(item => item.category)));

  return (
    <View style={{ paddingVertical: 10 }}>
      <Animated.FlatList
        horizontal
        data={uniqueCategories}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <Chip selected={item === filtroCategoria} style={{ marginRight: 8 }} onPress={() => setFiltroCategoria(item === filtroCategoria ? null : item)}>
            <Text style={{ fontSize: fontSizes.medium }}>{item}</Text>
          </Chip>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
