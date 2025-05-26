import React from "react";
import { View, StyleSheet, useColorScheme, useWindowDimensions } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { fontSizes } from "../Themes/Typography";

export default function ListaSubtotal({ subtotal, limite }: { subtotal: number, limite: number }) {
  const { colors } = useTheme();
  const scheme = useColorScheme();
  const width = useWindowDimensions().width;

  const progressRaw = subtotal / limite;
  const progress = Math.min(subtotal / limite, 1);
  
  let progressColor = colors.primary;

  if (progressRaw > .5 && progressRaw <= 1) progressColor = scheme === 'dark' ? '#FFA000' : '#FFCA28' ;
  else if (progressRaw > 1) progressColor = colors.error;

  const preenchimento = Math.min(progress, 1) * width;

  return (
    <View>
    <View style={styles.container}>
      <Text style={styles.text}>Subtotal: <Text style={{ color: progressColor, fontWeight: "bold" }}>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(subtotal)}</Text></Text>
    </View>
    <View style={[styles.barraFundo, {width: width,borderTopRightRadius: progressRaw >= 1 ? 10 : 0, borderBottomRightRadius: progressRaw >= 1 ? 10 : 0}]}>
      <View style={[styles.barraProgresso, { width: preenchimento, backgroundColor: progressColor }]} />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderTopWidth: 1,
    // borderTopColor: "#ccc",
    // backgroundColor: "#DCEDC8",
    alignItems: "flex-end",
  },
  text: {
    fontSize: fontSizes.medium,
    fontWeight: "bold",
  },
  barraFundo: {
    // width: 300,
    height: 20,
    backgroundColor: "#E0E0E0",
    // borderRadius: 10,
    overflow: "hidden",
  },
  barraProgresso: {
    height: 20,
    // borderRadius: 10,
  },
});
