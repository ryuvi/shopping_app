import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  useColorScheme,
} from "react-native";
import {
  Button,
  Modal,
  Text,
  Card,
  IconButton,
  Chip,
  Icon,
  useTheme,
  Portal,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { Itens } from "@db/schema";
import { fontSizes } from "@/screens/shared/ui/Typography";
import { useListaStore } from "@shared/hooks/useListaStore";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  lista: { id: string; nome: string; items: Itens[] } | null;
}

const ListaDetalhesModal = ({ visible, onDismiss, lista }: Props) => {
  if (!lista) return null;

  const { colors } = useTheme();
  const scheme = useColorScheme();
  const { width, height } = Dimensions.get("window");

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
              <tr><th>Nome</th><th>Quantidade</th><th>Peso</th><th>Preço</th><th>Preço Total</th></tr>
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

  const renderItem = ({ item }: { item: Itens }) => (
    <Card
      style={[
        styles.card,
        {
          borderColor: item.isPromocao ? "#FFD700" : colors.outline,
          backgroundColor: colors.surface,
        },
      ]}
    >
      <Card.Content>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
                color: colors.onSurface,
              }}
            >
              {item.nome}
            </Text>
          </View>
          <Text style={{ fontSize: fontSizes.small, color: colors.onSurface }}>
            Qtd:{" "}
            <Text
              style={{
                fontWeight: "bold",
                fontSize: fontSizes.normal,
              }}
            >
              {item.quantity}x
            </Text>
          </Text>
        </View>

        <Text style={{ fontSize: fontSizes.small, color: colors.onSurface }}>
          Preço Unitário:{" "}
          <Text
            style={{ fontWeight: "bold", fontSize: fontSizes.normal }}
          >
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(item.price)}
          </Text>
        </Text>

        <Text style={{ fontSize: fontSizes.small, color: colors.onSurface }}>
          Peso:{" "}
          <Text
            style={{ fontWeight: "bold", fontSize: fontSizes.normal }}
          >
            {item.peso} kg
          </Text>
        </Text>

        <Text style={{ fontSize: fontSizes.small, color: colors.onSurface }}>
          Preço Total:{" "}
          <Text
            style={{ fontWeight: "bold", fontSize: fontSizes.normal }}
          >
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(
              item.peso != 1
                ? item.price * item.peso
                : item.price * item.quantity
            )}
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
            }}
          >
            {item.category}
          </Chip>
        </View>
      </Card.Actions>
    </Card>
  );

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          {
            backgroundColor: colors.surface,
            maxHeight: height * 0.85,
            width: width * 0.9,
            alignSelf: "center",
          },
        ]}>
        <View /* style={styles.overlay} */>
            <View style={styles.header}>
              <Text variant="titleLarge" style={{ color: colors.onBackground }}>
                {lista.nome}
              </Text>
              <IconButton
                icon="close"
                onPress={onDismiss}
                iconColor={colors.primary}
              />
            </View>

            <FlatList
              data={lista.items}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            />

            <View style={styles.buttons}>
              <Button
                mode="outlined"
                onPress={() => {
                  useListaStore.getState().iniciarEdicao({
                    id: lista.id,
                    nome: lista.nome,
                    items: lista.items,
                  });
                  onDismiss();
                }}
                style={styles.botao}
              >
                Editar Lista
              </Button>
              <Button mode="contained" onPress={exportarCSV} style={styles.botao}>
                Exportar CSV
              </Button>
              <Button mode="contained" onPress={exportarPDF} style={styles.botao}>
                Exportar PDF
              </Button>
            </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    padding: 16,
    borderRadius: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  card: {
    marginVertical: 6,
    borderWidth: 1,
    borderRadius: 12,
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
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
});

export default ListaDetalhesModal;
