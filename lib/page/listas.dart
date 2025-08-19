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
                    Icon(
                      Icons.shopping_cart_outlined,
                      size: 64,
                      color: Theme.of(context).colorScheme.onPrimaryContainer,
                    ),
                    SizedBox(height: 10),
                    Text(
                      "Você está sem listas salvas!",
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
            final listname = box.keys.toList()[index];
            final products = List<Map<dynamic, dynamic>>.from(box.getAt(index));
            final productCount = products.length;

            return Dismissible(
              key: UniqueKey(),
              direction: DismissDirection.horizontal,
              background: Container(
                color: Theme.of(context).colorScheme.inversePrimary,
                alignment: Alignment.centerLeft,
                padding: EdgeInsets.only(left: 20),
                child: Icon(Icons.edit, color: Theme.of(context).colorScheme.primary),
              ),
              secondaryBackground: Container(
                color: Theme.of(context).colorScheme.errorContainer,
                alignment: Alignment.centerRight,
                padding: EdgeInsets.only(right: 20),
                child: Icon(Icons.delete, color: Theme.of(context).colorScheme.onErrorContainer)
              ),
              onDismissed: (direction) async {
                if (direction == DismissDirection.startToEnd) {
                  for (var item in products) {
                    await produtosBox.add(item);
                  }

                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      behavior: SnackBarBehavior.fixed,
                      content: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          Text(
                            "Lista selecionada! Para editar/visualizar volte a tela inicial.",
                            style: TextStyle(color: Theme.of(context).colorScheme.onPrimary),
                          ),
                          Icon(Icons.check, color: Theme.of(context).colorScheme.onPrimary),
                        ],
                      ),
                      backgroundColor: Theme.of(context).colorScheme.primary,
                    ),
                  );
                } else if (direction == DismissDirection.endToStart) {
                  await listasBox.delete(listname);

                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      behavior: SnackBarBehavior.fixed,
                      content: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          Text(
                            "Lista deletada com sucesso!",
                            style: TextStyle(color: Theme.of(context).colorScheme.onPrimary),
                          ),
                          Icon(Icons.check, color: Theme.of(context).colorScheme.onPrimary),
                        ],
                      ),
                      backgroundColor: Theme.of(context).colorScheme.primary,
                    ),
                  );
                }
              },
              child: Container(
                width: double.infinity,
                padding: EdgeInsets.all(4),
                child: Card(
                  elevation: 6,
                  surfaceTintColor: Theme.of(context).colorScheme.inversePrimary,
                  shape: RoundedRectangleBorder(
                    side: BorderSide(
                      color: Theme.of(context).colorScheme.inversePrimary,
                      width: 2,
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  margin: EdgeInsets.all(4),
                  child: ListTile(
                    title: Text("$listname"),
                    subtitle: Text("Produtos: $productCount")
                  )
                ),
              )
            );
          },
        );
      },
    );
  }
}
