import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:intl/intl.dart';

import '../components/custom_modal.dart';
import '../components/card.dart';

class MeusProdutos extends StatefulWidget {
  @override
  _MeusProdutos createState() => _MeusProdutos();
}

class _MeusProdutos extends State<MeusProdutos> {
  late Box produtosBox;

  @override
  void initState() {
    super.initState();
    produtosBox = Hive.box('produtos');
  }

  String formatValue(double value) {
    return NumberFormat.currency(locale:'pt_BR',symbol:'R\$',decimalDigits:2).format(value);
  }

  void _saveList(String listName) async {
    final name = listName == null || listName.isEmpty
               ? "Lista do Dia ${DateFormat('dd/MM/yyyy').format(DateTime.now())}"
               : listName;

    final Box listasBox = Hive.box("listas");
    final Box produtosBox = Hive.box("produtos");

    List currentItems = produtosBox.values.toList();

    await listasBox.put(name, currentItems);
    await produtosBox.clear();

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Lista '$listName' salva com sucesso!"))
    );
  }

  void _showSaveDialog(BuildContext context) {
    final TextEditingController controller = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text("Salvar Lista"),
          content: TextField(
            controller: controller,
            decoration: InputDecoration(
              labelText: "Nome da Lista"
            )
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text("Cancelar")
            ),
            ElevatedButton(
              onPressed: () {
                _saveList(controller.text);
                Navigator.pop(context);
              },
              child: Text("Salvar"),
            )
          ]
        );
      }
    );
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder(
        valueListenable: produtosBox.listenable(),
        builder: (context, Box box, _) {
          if (box.isEmpty) {
            return Center(
              child: Card(
                color: Theme.of(context).colorScheme.primaryContainer,
                margin: const EdgeInsets.symmetric(horizontal: 40),
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.shopping_cart_outlined, size: 64, color: Theme.of(context).colorScheme.onPrimaryContainer),
                      SizedBox(height: 10),
                      Text(
                        "Sua lista está vazia!",
                        style: TextStyle(fontSize: 24, color: Theme.of(context).colorScheme.onPrimaryContainer)
                      ),
                      SizedBox(height:5),
                      Text(
                        "Clique no botão '+' para adicionar produtos",
                        style: TextStyle(fontSize: 16, color: Theme.of(context).colorScheme.onPrimaryContainer),
                        textAlign: TextAlign.center
                      )
                    ]
                  )
                )
              )
            );
          }

          double total = 0.0;
          for (var i=0; i < box.length; i++) {
            final item = box.getAt(i) as Map;
            final preco = item['preco'] as double;
            final qtd = item['quantidade'] as int;
            final peso = item['peso'] as double;
            total += (preco * qtd * peso);
          }
          String totalString = formatValue(total);

          return Column(
            children: [
              Container(
                width: double.infinity,
                color: Theme.of(context).colorScheme.secondaryContainer,
                padding: const EdgeInsets.all(16),
                child: Text(
                  "Total: $totalString",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.onSecondaryContainer)
                )
              ),
              Expanded(
                child: ListView.builder(
                  itemCount: box.length,
                  itemBuilder: (context, index) {
                    final item = Map<String, dynamic>.from(box.getAt(index));
                    return ItemCard(
                      nome: item['nome'],
                      preco: formatValue(item['preco']),
                      total: formatValue(item['preco'] * item['peso'] * item['quantidade']),
                      peso: item['peso'],
                      quantidade: item['quantidade'],
                      categoria: item['categoria'],
                      promotion: item['promocao'],
                      onTap: () {
                        showDialog(
                          context: context,
                          builder: (_) => CustomModal(
                            item: {...item, 'key': box.keyAt(index)}
                          )
                        );
                      },
                    );
                  }
                ),
              ),
            ]
          );
        }
    );
  }
}
