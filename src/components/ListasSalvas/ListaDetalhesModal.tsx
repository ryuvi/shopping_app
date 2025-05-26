import React from "react";
import { View, Modal, StyleSheet, FlatList } from "react-native";
import { Button, Text, Card, IconButton } from "react-native-paper";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { Item } from "../../interfaces/Item";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  lista: { nome_da_lista: string; items: Item[] } | null;
}

const ListaDetalhesModal = ({ visible, onDismiss, lista }: Props) => {
  if (!lista) return null;

  const exportarCSV = async () => {
    const header = "Nome,Quantidade,Preço\n";
    const rows = lista.items
      .map((item) => `${item.name},${item.quantity},${item.priceFull.toFixed(2)}`)
      .join("\n");
    const csv = header + rows;

    const fileUri = FileSystem.documentDirectory + `${lista.nome_da_lista}.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });

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
          <h1>${lista.nome_da_lista}</h1>
          <table>
            <thead>
              <tr><th>Nome</th><th>Quantidade</th><th>Preço</th></tr>
            </thead>
            <tbody>
              ${lista.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>R$ ${item.priceFull.toFixed(2)}</td>
                </tr>`).join("")}
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
          <Text variant="titleLarge">{lista.nome_da_lista}</Text>
          <IconButton icon="close" onPress={onDismiss} />
        </View>

        <FlatList
          data={lista.items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text>{item.name}</Text>
                <Text>Quantidade: {item.quantity}</Text>
                <Text>Preço: R$ {item.priceFull.toFixed(2)}</Text>
              </Card.Content>
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
});

export default ListaDetalhesModal;
