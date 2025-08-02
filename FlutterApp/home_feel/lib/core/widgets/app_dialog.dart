import 'package:flutter/material.dart';

enum AppDialogType { success, error, warning, info, offline, loading }

class AppDialog extends StatelessWidget {
  final String title;
  final String message;
  final AppDialogType type;
  final String? buttonText;
  final VoidCallback? onButtonPressed;
  final bool barrierDismissible;

  const AppDialog({
    required this.title,
    required this.message,
    required this.type,
    this.buttonText,
    this.onButtonPressed,
    this.barrierDismissible = true,
    Key? key,
  }) : super(key: key);

  Widget _buildIcon() {
    switch (type) {
      case AppDialogType.success:
        return Icon(Icons.check_circle, color: Colors.green, size: 56);
      case AppDialogType.error:
        return Icon(Icons.cancel, color: Colors.red, size: 56);
      case AppDialogType.warning:
        return Icon(Icons.warning, color: Colors.orange, size: 56);
      case AppDialogType.info:
        return Icon(Icons.info, color: Colors.blue, size: 56);
      case AppDialogType.offline:
        return Column(
          children: [
            Icon(Icons.wifi_off, color: Colors.orange, size: 56),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.orange[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text('WIFI', style: TextStyle(color: Colors.orange)),
            ),
          ],
        );
      case AppDialogType.loading:
        return CircularProgressIndicator();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildIcon(),
            const SizedBox(height: 16),
            Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            const SizedBox(height: 8),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 15),
            ),
            const SizedBox(height: 24),
            if (buttonText != null)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                    ),
                  ),
                  onPressed:
                      onButtonPressed ?? () => Navigator.of(context).pop(),
                  child: Text(
                    buttonText!,
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

Future<void> showAppDialog({
  required BuildContext context,
  required String title,
  required String message,
  required AppDialogType type,
  String? buttonText,
  VoidCallback? onButtonPressed,
  bool barrierDismissible = true,
}) {
  return showDialog(
    context: context,
    barrierDismissible: barrierDismissible,
    builder: (ctx) => AppDialog(
      title: title,
      message: message,
      type: type,
      buttonText: buttonText,
      onButtonPressed: onButtonPressed,
      barrierDismissible: barrierDismissible,
    ),
  );
}
