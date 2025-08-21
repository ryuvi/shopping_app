import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';

import '../components/despensa_modal.dart';

class Despensa extends StatefulWidget {
  @override
  _Despensa createState() => _Despensa();
}

class _Despensa extends State<Despensa> {
  late Box despensaBox;
  late Box produtosBox;

  @override
  void initState() {
    super.initState();
    despensaBox = Hive.box('despensa');
    produtosBox = Hive.box('produtos');
  }

  void decreaseItem(int index) {
    final item = despensaBox.getAt(index);
    item['quantidade'] = item['quantidade'] - 1;
    despensaBox.putAt(index, item);
  }

  void increaseItem(int index) {
    final item = despensaBox.getAt(index);
    item['quantidade'] = item['quantidade'] + 1;
    despensaBox.putAt(index, item);
  }

  void deleteItem(int index) {
    despensaBox.deleteAt(index);
  }

  void addToCart(int index) {
    final item = despensaBox.getAt(index);
    produtosBox.add({
      'nome': item['nome'],
      'preco': 0.0,
      'quantidade': 0.0,
      'categoria': '',
      'promocao': false,
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.fixed,
        content: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Text(
              "Produto enviado pro carrinho com sucesso!",
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
    return ValueListenableBuilder(
      valueListenable: despensaBox.listenable(),
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
                    Icon(
                      Icons.kitchen_outlined,
                      size: 64,
                      color: Theme.of(context).colorScheme.onPrimaryContainer,
                    ),
                    SizedBox(height: 10),
                    Text(
                      "Sua despensa está vazia!",
                      style: TextStyle(
                        fontSize: 24,
                        color: Theme.of(context).colorScheme.onPrimaryContainer,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }

        return ListView.builder(
          itemCount: box.length,
          itemBuilder: (context, index) {
            final item = Map<String, dynamic>.from(box.getAt(index));
            final itemName = item['nome'];
            final itemQtd = item['quantidade'];
            final itemCat = item['categoria'] ?? 'Sem Categoria';

            return Card(
              elevation: 6,
              surfaceTintColor: Theme.of(context).colorScheme.surfaceContainer,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              margin: EdgeInsets.all(8),
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              itemName,
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              "Quantidade: $itemQtd\nCategoria: $itemCat",
                              style: TextStyle(fontSize: 12),
                            ),
                          ],
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          spacing: 1.25,
                          children: [
                            IconButton(
                              onPressed: () => decreaseItem(index),
                              icon: Icon(
                                Icons.remove,
                                color: Colors.red.withValues(alpha: .5),
                              ),
                              tooltip: 'Remover uma unidade do produto',
                            ),
                            IconButton(
                              onPressed: () => deleteItem(index),
                              icon: Icon(
                                Icons.delete,
                                color: Theme.of(context).colorScheme.error,
                              ),
                              tooltip: 'Deletar o produto',
                            ),
                            IconButton(
                              onPressed: () {
                                showDialog(
                                  context: context,
                                  builder: (_) => DespensaModal(
                                    item: {...item, 'key': box.getAt(index)}
                                  )
                                );
                              },
                              icon: Icon(Icons.edit, color: Colors.lightBlue),
                              tooltip: 'Editar o produto',
                            ),
                            IconButton(
                              onPressed: () => addToCart(index),
                              icon: Icon(
                                Icons.shopping_cart,
                                color: Colors.orangeAccent,
                              ),
                              tooltip: 'Adicionar o produto ao carrinho',
                            ),
                            IconButton(
                              onPressed: () => increaseItem(index),
                              icon: Icon(Icons.add, color: Colors.greenAccent),
                              tooltip: 'Aumentar uma unidade do produto',
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}
