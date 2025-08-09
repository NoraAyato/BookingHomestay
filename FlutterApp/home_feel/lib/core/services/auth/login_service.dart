import 'package:flutter/material.dart';
import 'package:home_feel/features/auth/presentation/screens/login_screen.dart';
import 'package:home_feel/features/auth/presentation/screens/register_screen.dart';

class LoginService {
  static void showLoginOverlay(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => LoginScreen(
          onClose: () => Navigator.pop(context),
          onRegister: () {
            Navigator.pop(context);
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => RegisterScreen(
                  onClose: () => Navigator.pop(context),
                  onLogin: () {
                    Navigator.pop(context);
                    showLoginOverlay(context);
                  },
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  static void showLoginDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Yêu cầu đăng nhập'),
        content: const Text(
          'Bạn cần đăng nhập để tiếp tục. Vui lòng đăng nhập để tiếp tục.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Hủy'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              showLoginOverlay(context);
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.deepOrange),
            child: const Text('Đăng nhập'),
          ),
        ],
      ),
    );
  }
}
