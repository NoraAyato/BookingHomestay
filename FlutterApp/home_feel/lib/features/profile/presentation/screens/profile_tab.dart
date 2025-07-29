import 'package:flutter/material.dart';
import 'profile_screen.dart';
import 'package:home_feel/features/auth/presentation/screens/login_screen.dart';
import 'package:home_feel/features/auth/presentation/screens/register_screen.dart';

class ProfileTab extends StatelessWidget {
  final VoidCallback? onLogin;
  const ProfileTab({super.key, this.onLogin});

  @override
  Widget build(BuildContext context) {
    return ProfileScreen(onLogin: onLogin);
  }
}