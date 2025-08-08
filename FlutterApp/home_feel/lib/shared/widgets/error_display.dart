import 'package:flutter/material.dart';

class ErrorDisplay extends StatelessWidget {
  final String errorMessage;
  final double iconSize;
  final double fontSize;

  const ErrorDisplay({
    super.key,
    required this.errorMessage,
    this.iconSize = 48,
    this.fontSize = 16,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error, color: Colors.red, size: iconSize),
          const SizedBox(height: 8),
          Text(
            'Đã xảy ra lỗi: $errorMessage',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.red, fontSize: fontSize),
          ),
        ],
      ),
    );
  }
}
