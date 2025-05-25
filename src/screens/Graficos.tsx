import React, { JSX, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Appbar, Text, Divider, Surface } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart, BarChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";

type Historico = Record<string, number[]>;
type CategoriaMedia = Record<string, number>;

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

export default function GraficoHistorico(): JSX.Element {
  const [historico, setHistorico] = useState<Historico>({});
  const [categoriaMedia, setCategoriaMedia] = useState<CategoriaMedia>({});
  const [itemSelecionado, setItemSelecionado] = useState<string>("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>("");
  const [categorias, setCategorias] = useState<string[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Carrega histórico dos itens
      const histStr = await AsyncStorage.getItem("historico-items");
      const hist = histStr ? JSON.parse(histStr) : {};
      setHistorico(hist);
      const nomesItems = Object.keys(hist);
      if (nomesItems.length > 0) setItemSelecionado(nomesItems[0]);

      // Carrega múltiplas listas no formato [{ nome_da_lista, items: Item[] }]
      const listaStr = await AsyncStorage.getItem("lista-compras");
      const listas = listaStr ? JSON.parse(listaStr) : [];

      // Acumula soma e quantidade por categoria
      const categoriasAcumuladas: Record<string, { soma: number; qtd: number }> = {};

      for (const lista of listas) {
        for (const item of lista.items) {
          if (!categoriasAcumuladas[item.category]) {
            categoriasAcumuladas[item.category] = { soma: 0, qtd: 0 };
          }
          categoriasAcumuladas[item.category].soma += item.pricePerItem;
          categoriasAcumuladas[item.category].qtd += 1;
        }
      }

      // Calcula média por categoria
      const medias: CategoriaMedia = {};
      for (const cat in categoriasAcumuladas) {
        const { soma, qtd } = categoriasAcumuladas[cat];
        medias[cat] = soma / qtd;
      }
      setCategoriaMedia(medias);

      const nomesCategorias = Object.keys(medias);
      if (nomesCategorias.length > 0) setCategoriaSelecionada(nomesCategorias[0]);
      setCategorias(nomesCategorias);
    } catch (error) {
      console.error("Erro ao carregar dados do gráfico:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Histórico de Preços" />
      </Appbar.Header>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Histórico por Item</Text>
        <Surface style={styles.card}>
          <Picker
            selectedValue={itemSelecionado}
            onValueChange={setItemSelecionado}
            style={styles.picker}
          >
            {Object.keys(historico).map((item) => (
              <Picker.Item label={item} value={item} key={item} />
            ))}
          </Picker>

          {itemSelecionado && historico[itemSelecionado] && (
            <>
              <Text style={styles.chartTitle}>{itemSelecionado}</Text>
              <LineChart
                data={{
                  labels: historico[itemSelecionado].map((_, idx) => `${idx + 1}`),
                  datasets: [{ data: historico[itemSelecionado] }],
                }}
                width={screenWidth - 60}
                height={220}
                chartConfig={chartConfig}
                bezier
              />
            </>
          )}
        </Surface>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Média por Categoria</Text>
        <Surface style={styles.card}>
          <Picker
            selectedValue={categoriaSelecionada}
            onValueChange={setCategoriaSelecionada}
            style={styles.picker}
          >
            {categorias.map((cat) => (
              <Picker.Item label={cat} value={cat} key={cat} />
            ))}
          </Picker>

          {categoriaSelecionada && categoriaMedia[categoriaSelecionada] !== undefined && (
            <>
              <Text style={styles.chartTitle}>{categoriaSelecionada}</Text>
              <BarChart
                data={{
                  labels: [categoriaSelecionada],
                  datasets: [{ data: [categoriaMedia[categoriaSelecionada]] }],
                }}
                width={screenWidth - 60}
                height={260}
                chartConfig={chartConfig}
                fromZero
                yAxisLabel=""
                yAxisSuffix=""
              />
            </>
          )}
        </Surface>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#007AFF",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  picker: {
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
  },
  divider: {
    marginVertical: 16,
    height: 1,
  },
  card: {
    elevation: 2,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
});
