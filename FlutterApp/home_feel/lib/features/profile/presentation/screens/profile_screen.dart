import 'package:flutter/material.dart';
import 'package:home_feel/features/auth/presentation/screens/login_screen.dart';

class ProfileScreen extends StatelessWidget {
  final VoidCallback? onLogin;
  const ProfileScreen({super.key, this.onLogin});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.only(top: 40, left: 24, right: 24, bottom: 24),
            decoration: const BoxDecoration(
              color: Color(0xFFFFF3E0), // cam nhạt
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(24),
                bottomRight: Radius.circular(24),
              ),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 32,
                  backgroundColor: Colors.white,
                  child: Icon(Icons.person, size: 48, color: Colors.grey),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: GestureDetector(
                    onTap: onLogin,
                    child: const Text(
                      'Đăng nhập/ Đăng ký',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          // Cài đặt
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 24),
            child: Text('Cài đặt', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 8),
          ListTile(
            leading: const Icon(Icons.notifications_none, color: Color(0xFFFF9800)),
            title: const Text('Thông báo'),
            onTap: () {},
            minLeadingWidth: 32,
          ),
          ListTile(
            leading: const Icon(Icons.language, color: Color(0xFFFF9800)),
            title: const Text('Ngôn ngữ'),
            trailing: const Text('Tiếng Việt', style: TextStyle(color: Color(0xFFFF9800), fontWeight: FontWeight.w500)),
            onTap: () {},
            minLeadingWidth: 32,
          ),
          ListTile(
            leading: const Icon(Icons.location_on_outlined, color: Color(0xFFFF9800)),
            title: const Text('Khu vực'),
            trailing: const Text('Hồ Chí Minh', style: TextStyle(color: Color(0xFFFF9800), fontWeight: FontWeight.w500)),
            onTap: () {},
            minLeadingWidth: 32,
          ),
          const Divider(height: 32, thickness: 1, indent: 24, endIndent: 24),
          // Thông tin
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 24),
            child: Text('Thông tin', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 8),
          ListTile(
            leading: const Icon(Icons.help_outline, color: Color(0xFFFF9800)),
            title: const Text('Hỏi đáp'),
            onTap: () {},
            minLeadingWidth: 32,
          ),
          ListTile(
            leading: const Icon(Icons.shield_outlined, color: Color(0xFFFF9800)),
            title: const Text('Điều khoản & Chính sách bảo mật'),
            onTap: () {},
            minLeadingWidth: 32,
          ),
          ListTile(
            leading: const Icon(Icons.download_outlined, color: Color(0xFFFF9800)),
            title: const Text('Phiên bản'),
            trailing: const Text('15.69.0', style: TextStyle(color: Colors.grey)),
            minLeadingWidth: 32,
          ),
          ListTile(
            leading: const Icon(Icons.phone_outlined, color: Color(0xFFFF9800)),
            title: const Text('Liên hệ'),
            onTap: () {},
            minLeadingWidth: 32,
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}