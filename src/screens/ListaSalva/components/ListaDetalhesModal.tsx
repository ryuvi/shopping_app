import React from "react";
import { View, Modal, StyleSheet, FlatList } from "react-native";
import { Button, Text, Card, IconButton, Chip, Icon } from "react-native-paper";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { Itens } from "../../../db/schema";
import { useTheme } from "react-native-paper";
import { fontSizes } from "@/screens/shared/ui/Typography";
import { useColorScheme } from "react-native";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  lista: { nome: string; items: Itens[] } | null;
}

const ListaDetalhesModal = ({ visible, onDismiss, lista }: Props) => {
  if (!lista) return null;

  const { colors } = useTheme();
  const scheme = useColorScheme();

  const exportarCSV = async () => {
    const header = "Nome,Quantidade,Peso,Preço,PreçoTotal\n";
    const rows = lista.items
      .map(
        (item) =>
          `${item.nome},${item.quantity},${item.peso},${item.price.toFixed(
            2
          )},${(item.peso != 1
            ? item.price * item.peso
            : item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");
    const csv = header + rows;

    const fileUri = FileSystem.documentDirectory + `${lista.nome}.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: "text/csv",
      dialogTitle: "Exportar Lista como CSV",
    });
  };

  const exportarPDF = async () => {
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { color: #388E3C; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <img src="https://raw.githubusercontent.com/ryuvi/shopping_app/refs/heads/main/assets/logo.png" alt="Logo" />
          <h1>${lista.nome}</h1>
          <table>
            <thead>
              <tr><th>Nome</th><th>Quantidade</th><th>Peso</th><th>Preço</th><th<Preço Total</th></tr>
            </thead>
            <tbody>
              ${lista.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.nome}</td>
                  <td>${item.quantity}</td>
                  <td>${item.peso}</td>
                  <td>R$ ${item.price.toFixed(2)}</td>
                  <td>R$ ${(item.peso != 1
                    ? item.price * item.peso
                    : item.price * item.quantity
                  ).toFixed(2)}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "Exportar Lista como PDF",
    });
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onDismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="titleLarge">{lista.nome}</Text>
          <IconButton icon="close" onPress={onDismiss} />
        </View>

        <FlatList
          data={lista.items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card
              style={[
                styles.card,
                item.isPromocao ? styles.promotion : styles.not_promotion,
              ]}
            >
              <Card.Content>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {item.isPromocao && (
                      <Icon
                        source="star-outline"
                        color={scheme === "dark" ? "#FFA000" : "#FFCA28"}
                        size={24}
                      />
                    )}
                    <Text
                      style={{
                        marginLeft: item.isPromocao ? 8 : 0,
                        fontWeight: "bold",
                        fontSize: fontSizes.medium,
                      }}
                    >
                      {item.nome} {/* Usando item.nome conforme schema */}
                    </Text>
                  </View>
                  <Text style={{ fontSize: fontSizes.small }}>
                    Qtd:{" "}
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: fontSizes.normal,
                        fontStyle: "italic",
                      }}
                    >
                      {item.quantity}x
                    </Text>
                  </Text>
                </View>
                <Text style={{ fontSize: fontSizes.small }}>
                  Preço Unitário:{" "}
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: fontSizes.normal,
                      fontStyle: "italic",
                    }}
                  >
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.price)}
                  </Text>
                </Text>
                <Text style={{ fontSize: fontSizes.small }}>
                  Peso:{" "}
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: fontSizes.normal,
                      fontStyle: "italic",
                    }}
                  >
                    {item.peso} kg
                  </Text>
                </Text>
                <Text style={{ fontSize: fontSizes.small }}>
                  Preço Total:{" "}
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: fontSizes.normal,
                      fontStyle: "italic",
                    }}
                  >
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format((item.peso != 1 ? item.price * item.peso : item.price * item.quantity))}
                  </Text>
                </Text>
              </Card.Content>
              <Card.Actions>
                <View style={styles.actionsContainer}>
                  <Chip
                    textStyle={{
                      color: colors.primary,
                      fontSize: fontSizes.normal,
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    {item.category}
                  </Chip>
                </View>
              </Card.Actions>
            </Card>
          )}
        />

        <View style={styles.buttons}>
          <Button mode="contained" onPress={exportarCSV} style={styles.botao}>
            Exportar CSV
          </Button>
          <Button mode="contained" onPress={exportarPDF} style={styles.botao}>
            Exportar PDF
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    marginVertical: 6,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 12,
  },
  botao: {
    flex: 1,
    marginHorizontal: 6,
  },
  promotion: {
    borderColor: "#FFD700", // Cor dourada para promoção
  },
  not_promotion: {
    borderColor: "#E0E0E0", // Cor cinza para itens normais
  },
  actionsContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    paddingHorizontal: 10
  },
});

export default ListaDetalhesModal;
