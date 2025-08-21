import 'package:flutter/material.dart';

class CustomAppBarItem {
  IconData icon;
  bool hasNotification = false;

  CustomAppBarItem({required this.icon, this.hasNotification = false});
}

class CustomAppBar extends StatefulWidget {
  final ValueChanged<int> onTabSelected;
  final List<CustomAppBarItem> items;

  CustomAppBar({required this.onTabSelected, required this.items}) {
    assert(this.items.length == 2 || this.items.length == 4);
  }

  @override
  _CustomAppBarState createState() => _CustomAppBarState();
}

class _CustomAppBarState extends State<CustomAppBar> {
  int _selectedIndex = 0;

  void _updateIndex(int index) {
    widget.onTabSelected(index);
    setState(() {
      _selectedIndex = index;
    });
  }

  Widget _buildTabIcon({required int index, required CustomAppBarItem item, required ValueChanged<int> onPressed, required BuildContext context}) {
    return Expanded(
      child: SizedBox(
        height: 60.0,
        child: Material(
          type: MaterialType.transparency,
          child: InkWell(
            onTap: () => onPressed(index),
            child: Container(
              decoration: BoxDecoration(
                // color: _selectedIndex == index ? Theme.of(context).colorScheme.inversePrimary : Colors.transparent,
                borderRadius: BorderRadius.circular(24)
              ),
              child: Icon(
                item.icon,
                color: _selectedIndex == index ? Theme.of(context).colorScheme.onPrimaryContainer : Theme.of(context).colorScheme.onPrimaryContainer.withValues(alpha: .25),
                size: 32.0,
                fill: .75,
              )
            )
          )
        )
      )
    );
  }

  Widget _buildMiddleSeparator() {
    return Expanded(
      child: SizedBox(
        height: 60.0,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            SizedBox(
              height: 24.0
            )
          ]
        )
      )
    );
  }

  @override
  Widget build(BuildContext context) {
    List<Widget> items = List.generate(widget.items.length, (int index) {
      return _buildTabIcon(
        index: index,
        item: widget.items[index],
        onPressed: _updateIndex,
        context: context
      );
    });
    items.insert(items.length >> 1, _buildMiddleSeparator());

    return BottomAppBar(
      color: Theme.of(context).colorScheme.primaryContainer,
      shape: CircularNotchedRectangle(),
      child: Container(
        height: 60.0,
        child: Row(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: items,
        )
      ),
    );
  }
}
