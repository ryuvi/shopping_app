import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:hive_flutter/hive_flutter.dart';

class AnalyticsPage extends StatefulWidget {
  @override
  _AnalyticsPageState createState() => _AnalyticsPageState();
}

class _AnalyticsPageState extends State<AnalyticsPage> {
  late Box listasBox;

  @override
  void initState() {
    super.initState();
    listasBox = Hive.box('listas');
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder(
      valueListenable: listasBox.listenable(),
      builder: (context, Box box, _) {
        List<dynamic> listas = box.values.toList();

        Map<String, double> categoriaCount = {};
        Map<String, double> categoriaGasto = {};
        for (var lista in listas) {
          for (var produto in lista) {
            String? categoria = produto['categoria'];
            if (categoria != null && categoria.isNotEmpty) {
              categoriaCount[categoria] = (categoriaCount[categoria] ?? 0) + 1;
              categoriaGasto[categoria] =
                  (categoriaGasto[categoria] ?? 0.0) +
                  produto['preco'] * produto['quantidade'];
            }
          }
        }

        final categorias = categoriaCount.keys.toList();
        final contagens = categoriaCount.values.toList();
        final valores = categoriaGasto.values.toList();

        final cores = [
          Colors.blue,
          Colors.red,
          Colors.green,
          Colors.orange,
          Colors.purple,
          Colors.teal,
          Colors.brown,
        ];

        // Pie chart with legend and percentage labels
        Widget buildPieChartWithLegend({
          required List<double> values,
          required String title,
        }) {
          double total = values.fold(0, (sum, v) => sum + v);
          return Container(
            padding: EdgeInsets.all(16),
            color: Theme.of(context).colorScheme.surfaceContainer,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 20),
                if (categorias.isEmpty)
                  Text("Nenhum dado disponível")
                else
                  SizedBox(
                    height: 300,
                    child: Row(
                      children: [
                        // Pie chart
                        Expanded(
                          flex: 2,
                          child: PieChart(
                            PieChartData(
                              sections: List.generate(categorias.length, (index) {
                                final percentage =
                                    total == 0 ? 0 : (values[index] / total) * 100;
                                return PieChartSectionData(
                                  value: values[index],
                                  color: cores[index % cores.length],
                                  title: "${percentage.toStringAsFixed(1)}%",
                                  titleStyle: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                  radius: 80,
                                );
                              }),
                              sectionsSpace: 2,
                              centerSpaceRadius: 0,
                            ),
                          ),
                        ),
                        SizedBox(width: 16),
                        // Legend
                        Expanded(
                          flex: 1,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: List.generate(categorias.length, (index) {
                              return Padding(
                                padding: const EdgeInsets.symmetric(vertical: 4),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 16,
                                      height: 16,
                                      color: cores[index % cores.length],
                                    ),
                                    SizedBox(width: 8),
                                    Expanded(child: Text(categorias[index])),
                                  ],
                                ),
                              );
                            }),
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          );
        }

        // Bar chart for gastos por categoria
        Widget buildBarChart({
          required List<String> labels,
          required List<double> values,
          required String title,
        }) {
          return Container(
            padding: EdgeInsets.all(16),
            color: Theme.of(context).colorScheme.surfaceContainer,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 20),
                if (labels.isEmpty)
                  Text("Nenhum dado disponível")
                else
                  SizedBox(
                    height: 300,
                    child: BarChart(
                      BarChartData(
                        alignment: BarChartAlignment.spaceAround,
                        maxY: values.isEmpty
                            ? 10
                            : values.reduce((a, b) => a > b ? a : b) + 5,
                        barGroups: List.generate(labels.length, (index) {
                          return BarChartGroupData(
                            x: index,
                            barRods: [
                              BarChartRodData(
                                toY: values[index],
                                color: cores[index % cores.length],
                                width: 20,
                                borderRadius: BorderRadius.circular(6),
                              ),
                            ],
                          );
                        }),
                        titlesData: FlTitlesData(
                          bottomTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              getTitlesWidget: (value, meta) {
                                int index = value.toInt();
                                if (index < 0 || index >= labels.length) {
                                  return SizedBox.shrink();
                                }
                                return SideTitleWidget(
                                  meta: meta,
                                  child: Text(labels[index]),
                                );
                              },
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          );
        }

        return ListView(
          padding: EdgeInsets.all(16),
          children: [
            buildPieChartWithLegend(
              values: contagens,
              title: "Categorias Mais Compradas",
            ),
            SizedBox(height: 40),
            buildBarChart(
              labels: categorias,
              values: valores,
              title: "Gastos Por Categoria",
            ),
          ],
        );
      },
    );
  }
}
