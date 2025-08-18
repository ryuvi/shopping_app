import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';

class CustomModal extends StatefulWidget {
  final Map<String, dynamic>? item;

  const CustomModal({super.key, this.item});

  @override
  State<CustomModal> createState() => _CustomModalState();
}

class _CustomModalState extends State<CustomModal> {
  // Controllers
  late TextEditingController nomeController;
  late TextEditingController precoController;
  late TextEditingController pesoController;
  late TextEditingController quantidadeController;
  late TextEditingController categoriaController;

  bool isPromotion = false;

  @override
  void initState() {
    super.initState();

    nomeController = TextEditingController(text: widget.item?['nome'] ?? '');
    precoController = TextEditingController(text: widget.item?['preco']?.toString() ?? '');
    pesoController = TextEditingController(text: widget.item?['peso']?.toString() ?? '');
    quantidadeController = TextEditingController(text: widget.item?['quantidade']?.toString() ?? '');
    categoriaController = TextEditingController(text: widget.item?['categoria']?.toString() ?? '');

    isPromotion = widget.item?['promocao'] ?? false;
  }

  @override
  void dispose() {
    nomeController.dispose();
    precoController.dispose();
    pesoController.dispose();
    quantidadeController.dispose();
    categoriaController.dispose();
    super.dispose();
  }

  void salvarProduto() async {
    var produtosBox = Hive.box('produtos');
    Map<String, dynamic> newItem = {
      'nome': nomeController.text,
      'preco': double.tryParse(precoController.text) ??0.0,
      'peso': double.tryParse(pesoController.text) ?? 0.0,
      'quantidade': int.tryParse(quantidadeController.text) ?? 0,
      'categoria': categoriaController.text,
      'promocao': isPromotion
    };

    if (widget.item != null && widget.item!['key'] != null) {
      await produtosBox.put(widget.item!['key'], newItem);
    } else {
      await produtosBox.add(newItem);
    }

    Navigator.pop(context);
  }

  void deletarProduto() async {
    var produtosBox = Hive.box('produtos');
    if (widget.item != null && widget.item!['key'] != null) {
      await produtosBox.delete(widget.item!['key']);
    }
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text("Adicionar produto"),

      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller:nomeController,
              decoration: InputDecoration(
                labelText: "Nome",
                labelStyle: TextStyle(color: Theme.of(context).colorScheme.primary),
                border: OutlineInputBorder(),
                filled: true,
                fillColor: Theme.of(context).colorScheme.surface
              ),
            ),
            const SizedBox(height: 10),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(child:
                TextField(
                  controller:precoController,
                    decoration: InputDecoration(
                    labelText: "Preço",
                    labelStyle: TextStyle(color: Theme.of(context).colorScheme.primary),
                    border: OutlineInputBorder(),
                    filled: true,
                    fillColor: Theme.of(context).colorScheme.surface
                  ),
                )),

                const SizedBox(width:10),

                Expanded(child:
                TextField(
                  controller:pesoController,
                  decoration: InputDecoration(
                    labelText: "Peso",
                    labelStyle: TextStyle(color: Theme.of(context).colorScheme.primary),
                    border: OutlineInputBorder(),
                    filled: true,
                    fillColor: Theme.of(context).colorScheme.surface
                  ),
                )),
              ],
            ),
            const SizedBox(height: 10),

            TextField(
              controller:quantidadeController,
              decoration: InputDecoration(
                labelText: "Quantidade",
                labelStyle: TextStyle(color: Theme.of(context).colorScheme.primary),
                border: OutlineInputBorder(),
                filled: true,
                fillColor: Theme.of(context).colorScheme.surface
              ),
            ),
            const SizedBox(height: 10),

            TextField(
              controller:categoriaController,
              decoration: InputDecoration(
                labelText: "Categoria",
                labelStyle: TextStyle(color: Theme.of(context).colorScheme.primary),
                border: OutlineInputBorder(),
                filled: true,
                fillColor: Theme.of(context).colorScheme.surface
              ),
            ),
            const SizedBox(height: 10),

            CheckboxListTile(
              title: const Text("Promoção?"),
              value: isPromotion,
              onChanged: (value) {
                setState(() {
                  isPromotion = value ?? false;
                });
              },
              controlAffinity: ListTileControlAffinity.leading,
            )
          ]
        )
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text("Fechar")
        ),
        OutlinedButton(
          onPressed: deletarProduto,
          child: const Text("Excluir")
        ),
        ElevatedButton(
          onPressed:salvarProduto,
          child: const Text("Adicionar")
        )
      ],
    );
  }
}

