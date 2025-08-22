import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;

import 'states/list_name.dart';

import 'components/products_modal.dart';
import 'components/despensa_modal.dart';
import 'components/bar_item.dart';

import 'page/charts.dart';
import 'page/despensa.dart';
import 'page/produtos.dart';
import 'page/listas.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Hive.initFlutter();
  await Hive.openBox('produtos');
  await Hive.openBox('listas');
  await Hive.openBox('despensa');

  runApp(
    ChangeNotifierProvider(
      create: (_) => ListNameState(),
      child: MaterialApp(
        theme: ThemeData.from(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.lightGreen, brightness: Brightness.light),
          useMaterial3: true,
        ),
        darkTheme: ThemeData.from(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.green, brightness: Brightness.dark),
          useMaterial3: true,
        ),
        themeMode: ThemeMode.system,
        home: MeuGuiaCompras(),
      ),
    )
  );
}

class MeuGuiaCompras extends StatefulWidget {
  @override
  _ListSubTotalState createState() => _ListSubTotalState();
}

class _ListSubTotalState extends State<MeuGuiaCompras> {
  int _currentIndex = 0;
  late stt.SpeechToText _speech;
  bool _isListening = false;
  String _lastWords = '';

  final List<Widget> _pages = [
    MeusProdutos(),
    MinhasListas(),
    Despensa(),
    AnalyticsPage(),
  ];

  @override
  void initState() {
    super.initState();
    _speech = stt.SpeechToText();
  }

  void _selectedTab(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  void startListening() async {
    bool available = await _speech.initialize(
      onStatus: (status) => {},
      onError: (error) => (),
    );

    if (available) {
      setState(() => _isListening = true);
      _speech.listen(
        onResult: (result) {
          setState(() {
            _lastWords = result.recognizedWords;
          });

          processCommand(_lastWords);
        },
      );
    }
  }

  void processCommand(String command) {
    command = command.toLowerCase();

    if (command.contains('adicionar')) {
      final regex = RegExp(r'adicionar (.+)');
      final match = regex.firstMatch(command);

      if (match != null) {
        final item = match.group(1);
        if (item != null && item.isNotEmpty) {
          var produtos = Hive.box('produtos');
          Map<String, dynamic> newItem = {
            'nome': item,
            'preco': 0.0,
            'quantidade': 0.0,
            'categoria': '',
            'promocao': false,
          };
          produtos.add(newItem);
        }
      }
    }
  }

  void stopListening() {
    _speech.stop();
    super.dispose();
  }

  String formatValue(double value) {
    return NumberFormat.currency(
      locale: 'pt_BR',
      symbol: 'R\$',
      decimalDigits: 2,
    ).format(value);
  }

  void _saveList(String listName) async {
    final name = listName.isEmpty
        ? Provider.of<ListNameState>(context, listen: false).listName
        : listName;

    if (!Provider.of<ListNameState>(context, listen: false).isEditing) {
      Provider.of<ListNameState>(context, listen: false).setListName(name);
    }

    final Box listasBox = Hive.box("listas");
    final Box produtosBox = Hive.box("produtos");

    var currentItems = produtosBox.values.toList();

    await listasBox.put(name, currentItems);
    await produtosBox.clear();

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        content: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Text(
              "Lista $name salva com sucesso!",
              style: TextStyle(color: Theme.of(context).colorScheme.onPrimary),
            ),
            Icon(Icons.check, color: Theme.of(context).colorScheme.onPrimary),
          ],
        ),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
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

  bool isDarkMode(BuildContext context) {
    return MediaQuery.of(context).platformBrightness == Brightness.dark;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: isDarkMode(context) ? Colors.deepOrange[900]!.withValues(alpha: .5) : Colors.deepOrange[100],
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
              fit: BoxFit.cover,
            );
          },
        ),
        actions: (_currentIndex == 0
            ? [
                IconButton(
                  icon: Icon(Icons.mic),
                  onPressed: _isListening ? startListening : stopListening,
                  tooltip: "Adicionar item por fala!",
                ),
                IconButton(
                  icon: Icon(Icons.save),
                  onPressed: () {
                    final listState = Provider.of<ListNameState>(context, listen: false);
                    if (listState.isEditing) {
                       _saveList(listState.listName);
                    } else {
                      _showSaveDialog(context);
                    }
                  },
                  tooltip: "Salvar Lista!",
                ),
              ]
            : []),
      ),
      body: IndexedStack(index: _currentIndex, children: _pages),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: FloatingActionButton(
        autofocus: false,
        onPressed: () {
          showDialog(
            context: context,
            builder: (context) =>
                _currentIndex != 2 ? ProductsModal() : DespensaModal(),
          );
        },
        tooltip: 'Adicionar Item',
        shape: CircleBorder(),
        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
        child: Icon(
          Icons.add,
          color: Theme.of(context).colorScheme.onPrimaryContainer,
        ),
      ),
      bottomNavigationBar: CustomAppBar(
        onTabSelected: _selectedTab,
        items: [
          CustomAppBarItem(icon: Icons.shopping_cart),
          CustomAppBarItem(icon: Icons.list),
          CustomAppBarItem(icon: Icons.kitchen),
          CustomAppBarItem(icon: Icons.analytics),
        ],
      ),
    );
  }
}
