import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';

class ProductsModal extends StatefulWidget {
  final Map<String, dynamic>? item;

  const ProductsModal({super.key, this.item});

  @override
  State<ProductsModal> createState() => _ProductsModalState();
}

class _ProductsModalState extends State<ProductsModal> {
  // Controllers
  late TextEditingController nomeController;
  late TextEditingController precoController;
  late TextEditingController quantidadeController;
  late TextEditingController categoriaController;

  bool isPromotion = false;

  @override
  void initState() {
    super.initState();

    nomeController = TextEditingController(text: widget.item?['nome'] ?? '');
    precoController = TextEditingController(
      text: widget.item?['preco']?.toString() ?? '',
    );
    quantidadeController = TextEditingController(
      text: widget.item?['quantidade']?.toString() ?? '',
    );
    categoriaController = TextEditingController(
      text: widget.item?['categoria']?.toString() ?? '',
    );

    isPromotion = widget.item?['promocao'] ?? false;
  }

  @override
  void dispose() {
    nomeController.dispose();
    precoController.dispose();
    quantidadeController.dispose();
    categoriaController.dispose();
    super.dispose();
  }

  void salvarProduto() async {
    var produtosBox = Hive.box('produtos');
    Map<String, dynamic> newItem = {
      'nome': nomeController.text,
      'preco': double.tryParse(precoController.text) ?? 0.0,
      'quantidade': double.tryParse(quantidadeController.text) ?? 0.0,
      'categoria': categoriaController.text,
      'promocao': isPromotion,
    };

    if (widget.item != null && widget.item!['key'] != null) {
      await produtosBox.put(widget.item!['key'], newItem);
    } else {
      await produtosBox.add(newItem);
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        content: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Text(
              "Produto adicionado com sucesso!",
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

  void deletarProduto() async {
    var produtosBox = Hive.box('produtos');
    if (widget.item != null && widget.item!['key'] != null) {
      await produtosBox.delete(widget.item!['key']);
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        content: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Text(
              "Produto deletado com sucesso!",
              style: TextStyle(
                color: Theme.of(context).colorScheme.onPrimaryContainer,
              ),
            ),
            Icon(Icons.check, color: Theme.of(context).colorScheme.primary),
          ],
        ),
        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
      ),
    );

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Row(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          Text(widget.item == null ? 'Adicionar Produto' : 'Editar Produto'),
          IconButton(
            icon: Icon(Icons.close),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),

      content: SizedBox(
        width: 350,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.max,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextField(
                controller: nomeController,
                decoration: InputDecoration(
                  labelText: "Nome",
                  labelStyle: TextStyle(
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  border: OutlineInputBorder(),
                  filled: true,
                  fillColor: Theme.of(context).colorScheme.surface,
                ),
              ),

              const SizedBox(height: 10),

              TextField(
                controller: precoController,
                decoration: InputDecoration(
                  labelText: "Preço",
                  labelStyle: TextStyle(
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  border: OutlineInputBorder(),
                  filled: true,
                  fillColor: Theme.of(context).colorScheme.surface,
                ),
              ),

              const SizedBox(height: 10),

              TextField(
                controller: quantidadeController,
                decoration: InputDecoration(
                  labelText: "Quantidade",
                  labelStyle: TextStyle(
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  border: OutlineInputBorder(),
                  filled: true,
                  fillColor: Theme.of(context).colorScheme.surface,
                ),
              ),

              const SizedBox(height: 10),

              TextField(
                controller: categoriaController,
                decoration: InputDecoration(
                  labelText: "Categoria",
                  labelStyle: TextStyle(
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  border: OutlineInputBorder(),
                  filled: true,
                  fillColor: Theme.of(context).colorScheme.surface,
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
                controlAffinity: ListTileControlAffinity.platform,
              ),
            ],
          ),
        ),
      ),
      actions: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            OutlinedButton(
              onPressed: deletarProduto,
              child: const Text("Excluir"),
            ),
            ElevatedButton(
              onPressed: salvarProduto,
              child: Text(widget.item == null ? "Adicionar" : 'Salvar'),
            ),
          ],
        ),
      ],
    );
  }
}
