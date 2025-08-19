import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:intl/intl.dart';

import 'components/custom_modal.dart';
import 'components/card.dart';

import 'page/produtos.dart';
import 'page/listas.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Hive.initFlutter();
  await Hive.openBox('produtos');
  await Hive.openBox('listas');

  runApp(
    MaterialApp(
      theme: ThemeData.from(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        useMaterial3: true,
      ),
      home: MeuGuiaCompras(),
    ),
  );
}

class MeuGuiaCompras extends StatefulWidget {
  @override
  _ListSubTotalState createState() => _ListSubTotalState();
}

class _ListSubTotalState extends State<MeuGuiaCompras> {
  int _currentIndex = 0;

  final List<Widget> _pages = [MeusProdutos(), MinhasListas()];

  String formatValue(double value) {
    return NumberFormat.currency(
      locale: 'pt_BR',
      symbol: 'R\$',
      decimalDigits: 2,
    ).format(value);
  }

  void _saveList(String listName) async {
    final name = listName == null || listName.isEmpty
        ? DateFormat('dd/MM/yyyy').format(DateTime.now())
        : listName;

    final Box listasBox = Hive.box("listas");
    final Box produtosBox = Hive.box("produtos");

    List currentItems = produtosBox.values.toList();

    await listasBox.put("Lista do Dia $name", currentItems);
    await produtosBox.clear();

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Lista '$listName' salva com sucesso!")),
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
            decoration: InputDecoration(labelText: "Nome da Lista"),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text("Cancelar"),
            ),
            ElevatedButton(
              onPressed: () {
                _saveList(controller.text);
                Navigator.pop(context);
              },
              child: Text("Salvar"),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.deepOrange[50],
      appBar: AppBar(
        title: Text(
          'Meu Guia de Compras',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        elevation: 4,
        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
        foregroundColor: Theme.of(context).colorScheme.onPrimaryContainer,
        // surfaceTintColor: Colors.transparent,
        leading: Builder(
          builder: (BuildContext context) {
            // return Icon(Icons.shopping_cart_outlined);
            return Image.asset(
              'assets/images/logo.png',
              width: 32,
              height: 32,
              fit: BoxFit.cover
            );
          },
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.save),
            onPressed: () => _showSaveDialog(context),
          ),
        ],
      ),
      body: IndexedStack(index: _currentIndex, children: _pages),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          showDialog(
            context: context,
            builder: (context) => const CustomModal(),
          );
        },
        tooltip: 'Adicionar Item',
        shape: CircleBorder(),
        child: Icon(
          Icons.add,
          color: Theme.of(context).colorScheme.onPrimaryContainer,
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        shape: CircularNotchedRectangle(),
        color: Theme.of(context).colorScheme.primaryContainer,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Container(
              padding: EdgeInsets.symmetric(vertical: 4, horizontal: 16),
              decoration: BoxDecoration(
                // shape: BoxShape.circle,
                color: _currentIndex == 0
                    ? Theme.of(context).colorScheme.surface
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(24),
              ),
              child: IconButton(
                onPressed: () => setState(() => _currentIndex = 0),
                icon: Icon(
                  Icons.shopping_cart,
                  color: _currentIndex == 0
                      ? Theme.of(context).colorScheme.primary
                      : Theme.of(context).colorScheme.surface,
                ),
              ),
            ),
            Container(
              padding: EdgeInsets.symmetric(vertical: 4, horizontal: 16),
              decoration: BoxDecoration(
                // shape: BoxShape.circle,
                color: _currentIndex == 1
                    ? Theme.of(context).colorScheme.surface
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(24),
              ),
              child: IconButton(
                onPressed: () => setState(() => _currentIndex = 1),
                icon: Icon(
                  Icons.view_list,
                  color: _currentIndex == 1
                      ? Theme.of(context).colorScheme.primary
                      : Theme.of(context).colorScheme.surface,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
