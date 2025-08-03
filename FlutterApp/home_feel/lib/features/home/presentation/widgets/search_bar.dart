import 'package:flutter/material.dart';

class HomeSearchBar extends StatelessWidget {
  const HomeSearchBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 1.0),
      child: TextField(
        readOnly: true,
        showCursor: false,
        decoration: InputDecoration(
          hintText: 'Tên khách sạn, huyện/quận',
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(25.0),
            borderSide: BorderSide.none,
          ),
          filled: true,
          fillColor: Colors.white,
          prefixIcon: const Icon(
            Icons.search,
            color: Colors.orange,
            size: 16.0,
          ),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 12.0,
            vertical: 3.0,
          ),
        ),
        onTap: () {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(const SnackBar(content: Text('Mở màn hình tìm kiếm')));
        },
      ),
    );
  }
}
