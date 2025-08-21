import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';

class DespensaModal extends StatefulWidget {
  final Map<String, dynamic>? item;

  const DespensaModal({super.key, this.item});

  @override
  State<DespensaModal> createState() => _DespensaModalState();
}

class _DespensaModalState extends State<DespensaModal> {
  // Controllers
  late TextEditingController nomeController;
  late TextEditingController quantidadeController;
  late TextEditingController categoriaController;

  @override
  void initState() {
    super.initState();

    nomeController = TextEditingController(text: widget.item?['nome'] ?? '');
    quantidadeController = TextEditingController(
      text: widget.item?['quantidade']?.toString() ?? '',
    );
    categoriaController = TextEditingController(
      text: widget.item?['categoria'] ?? ''
    );
  }

  @override
  void dispose() {
    nomeController.dispose();
    quantidadeController.dispose();
    categoriaController.dispose();
    super.dispose();
  }

  void salvarProduto() async {
    var produtosBox = Hive.box('despensa');
    Map<String, dynamic> newItem = {
      'nome': nomeController.text,
      'quantidade': double.tryParse(quantidadeController.text) ?? 0.0,
      'categoria': categoriaController.text
    };

    if (widget.item != null && widget.item!['key'] != null) {
      await produtosBox.put(widget.item!['key'], newItem);
    } else {
      await produtosBox.add(newItem);
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.fixed,
        content: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Text(
              "Produto salvo com sucesso!",
              style: TextStyle(color: Theme.of(context).colorScheme.onPrimary),
            ),
            Icon(Icons.check, color: Theme.of(context).colorScheme.onPrimary),
          ],
        ),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
    );

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(widget.item == null ? 'Adicionar Produto' : 'Editar Produto'),
          IconButton(
            icon: const Icon(Icons.close),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
      content: SizedBox(
        width: 300,
        child: SingleChildScrollView(
          child: Column(
            children: [
              TextField(
                controller: nomeController,
                decoration: InputDecoration(
                  labelText: "Nome",
                  border: const OutlineInputBorder(),
                  labelStyle: TextStyle(
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  filled: true,
                  fillColor: Theme.of(context).colorScheme.surface,
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: quantidadeController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: "Quantidade",
                  border: const OutlineInputBorder(),
                  labelStyle: TextStyle(
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  filled: true,
                  fillColor: Theme.of(context).colorScheme.surface,
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: categoriaController,
                decoration: InputDecoration(
                  labelText: "Categoria",
                  border: const OutlineInputBorder(),
                  labelStyle: TextStyle(
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  filled: true,
                  fillColor: Theme.of(context).colorScheme.surface,
                ),
              ),
            ],
          ),
        ),
      ),
      actions: [
        Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            ElevatedButton(
              onPressed: salvarProduto,
              child: Text(widget.item == null ? "Adicionar" : "Salvar"),
            ),
          ],
        ),
      ],
    );
  }
}
