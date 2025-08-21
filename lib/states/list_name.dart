import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class ListNameState extends ChangeNotifier {
  String _listName = "Lista do dia ${DateFormat('dd/MM/yyyy').format(DateTime.now())}";
  bool _isEditing = false;

  String get listName => _listName;
  bool get isEditing => _isEditing;


  void setListName(String name) {
    _listName = name;
    notifyListeners();
  }

  void setIsEditing(bool edit) {
    _isEditing = edit;
    notifyListeners();
  }
}
