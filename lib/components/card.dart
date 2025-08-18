import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class ItemCard extends StatelessWidget {
  final String nome;
  final String preco;
  final String total;
  final double peso;
  final int    quantidade;
  final String categoria;
  final bool   promotion;

  final VoidCallback onTap;

  const ItemCard({
    Key? key,
    required this.nome,
    required this.preco,
    required this.total,
    required this.peso,
    required this.quantidade,
    required this.categoria,
    required this.promotion,
    required this.onTap
  }) : super(key: key);


  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Card(
        elevation: 6,
        surfaceTintColor: promotion ? Theme.of(context).colorScheme.inversePrimary : Theme.of(context).colorScheme.surface,
        shape: RoundedRectangleBorder(
          side: BorderSide(
            color: promotion ? Theme.of(context).colorScheme.primary : Theme.of(context).colorScheme.surface,
            width: 2
          ),
          borderRadius: BorderRadius.circular(16),
        ),
        margin: EdgeInsets.all(8),
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(nome, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(total, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
              SizedBox(height: 8),
              Text(
                "Preço Unitário: $preco\nPeso: $peso\nQuantidade: $quantidade\nCategoria: $categoria",
                style: TextStyle(fontSize: 12),
              ),
            ],
          )
        )
      )
    );
  }
}
