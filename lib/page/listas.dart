import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';

class MinhasListas extends StatefulWidget {
  @override
  _MinhasListas createState() => _MinhasListas();
}

class _MinhasListas extends State<MinhasListas> {
  late Box listasBox;
  late Box produtosBox;

  @override
  void initState() {
    super.initState();
    listasBox = Hive.box('listas');
    produtosBox = Hive.box('produtos');
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder(
      valueListenable: listasBox.listenable(),
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
                      "Você está sem listas salvas!",
                      style: TextStyle(fontSize: 24, color: Theme.of(context).colorScheme.onPrimaryContainer)
                    ),
                  ]
                )
              )
            )
          );
        }

        return ListView.builder(
          itemCount: box.length,
          itemBuilder: (context, index) {
            final products = List<Map<dynamic, dynamic>>.from(box.getAt(index));
            final productCount = products.length;
            final listname = box.keys.toList()[index];


            return InkWell(
              onTap: () async {
                for (var item in products) {
                  await produtosBox.add(item);
                }

                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("Lista aberta, volte pra página de produtos para ver."))
                );
              },
              borderRadius: BorderRadius.circular(10),
              child:
                Card(
                  elevation: 6,
                  surfaceTintColor: Theme.of(context).colorScheme.inversePrimary,
                  shape: RoundedRectangleBorder(
                    side: BorderSide(
                      color: Theme.of(context).colorScheme.inversePrimary,
                      width: 2
                    ),
                    borderRadius: BorderRadius.circular(16)
                  ),
                  margin: EdgeInsets.all(8),
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "$listname",
                          style: TextStyle(fontSize: 16)
                        ),
                        SizedBox(height: 8),
                        Text(
                          "Produtos: $productCount",
                          style: TextStyle(fontSize: 12)
                        )
                      ]
                    )
                  ),
                )
            );
          }
        );
      }
    );
  }
}
