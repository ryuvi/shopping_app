import React from "react";
import { Appbar, useTheme } from "react-native-paper";
import { Image, View, StyleSheet } from "react-native";

export default function Header({
  title,
}: {
  title: string;
}) {
  const { colors } = useTheme();

  return (
    <Appbar.Header mode="center-aligned" elevated>
      <View style={styles.logoContainer}>
        <Image source={require("@assets/logo.png")} style={styles.logo} resizeMode="contain" />
      </View>
      <Appbar.Content title={title} titleStyle={styles.title} />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginLeft: 8,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 72,
    height: 72,
  },
  title: {
    fontWeight: "bold",
  },
});
