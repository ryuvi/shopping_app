import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:intl/intl.dart';

class ListaModal extends StatefulWidget {
  final String listName;

  const ListaModal({super.key, required this.listName});

  @override
  State<ListaModal> createState() => _ListaModalState();
}

class _ListaModalState extends State<ListaModal> {
  late Box produtosBox;
  late Box listasBox;

  @override
  void initState() {
    super.initState();
    produtosBox = Hive.box('produtos');
    listasBox = Hive.box('listas');
  }

  String formatValue(double value) {
    return NumberFormat.currency(
      locale: 'pt_BR',
      symbol: 'R\$',
      decimalDigits: 2,
    ).format(value);
  }

  void addItemToCart(Map<dynamic, dynamic> item, BuildContext context) {
    produtosBox.add(item);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        content: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Text(
              "Item ${item['nome']} adicionado ao carrinho com sucesso!",
              style: TextStyle(color: Theme.of(context).colorScheme.onPrimary),
            ),
            Icon(Icons.check, color: Theme.of(context).colorScheme.onPrimary),
          ],
        ),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(widget.listName),
          IconButton(
            icon: const Icon(Icons.close),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
      content: SizedBox(
        width: 300,
        child: ValueListenableBuilder(
          valueListenable: listasBox.listenable(),
          builder: (context, Box box, _) {
            final lista = List<Map<dynamic, dynamic>>.from(
              box.get(widget.listName) ?? [],
            );

            if (lista.isEmpty) {
              return Container(
                child: Center(
                  child: Card(
                    color: Theme.of(context).colorScheme.primaryContainer,
                    margin: const EdgeInsets.symmetric(horizontal: 40),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.shopping_cart_outlined,
                            size: 64,
                            color: Theme.of(
                              context,
                            ).colorScheme.onPrimaryContainer,
                          ),
                          SizedBox(height: 10),
                          Text(
                            "Sua lista está vazia!",
                            style: TextStyle(
                              fontSize: 24,
                              color: Theme.of(
                                context,
                              ).colorScheme.onPrimaryContainer,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }

            return Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    itemCount: lista.length,
                    itemBuilder: (context, index) {
                      final item =
                          lista[index]; // agora sim, um item individual
                      return Card(
                        elevation: 6,
                        surfaceTintColor: item['promocao'] == true
                            ? Theme.of(context).colorScheme.inversePrimary
                            : Theme.of(context).colorScheme.surface,
                        shape: RoundedRectangleBorder(
                          side: BorderSide(
                            color: item['promocao'] == true
                                ? Theme.of(context).colorScheme.primary
                                : Theme.of(context).colorScheme.surface,
                            width: 2,
                          ),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        margin: EdgeInsets.all(8),
                        child: Padding(
                          padding: EdgeInsets.all(16),
                          child: Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          item['nome'],
                                          style: TextStyle(
                                            fontSize: 20,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                    SizedBox(height: 8),
                                    Text(
                                      "Preço Total: ${formatValue(item['preco'] * item['quantidade'])}\n"
                                      "Preço Unitário: ${formatValue(item['preco'])}\n"
                                      "Quantidade/Peso: ${item['quantidade']}\n"
                                      "Categoria: ${item['categoria']}",
                                      style: TextStyle(fontSize: 12),
                                    ),
                                  ],
                                ),
                              ),
                              IconButton(
                                icon: Icon(Icons.shopping_cart),
                                onPressed: () => addItemToCart(item, context),
                                tooltip: "Adicionar item ao carrinho",
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
