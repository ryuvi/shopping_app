import { FAB, Portal } from "react-native-paper";
import { StyleSheet } from "react-native";

interface Props {
  onPress: () => void;
}

export default function FABAdicionarItem({ onPress }: Props) {
  return (<Portal><FAB icon="plus" style={styles.fab} onPress={onPress} /></Portal>);
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: '5%'
  },
});
