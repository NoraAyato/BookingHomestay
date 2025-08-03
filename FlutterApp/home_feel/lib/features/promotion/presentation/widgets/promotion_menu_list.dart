import 'package:flutter/material.dart';
import 'package:home_feel/features/promotion/presentation/screens/promotion_list_screen.dart';

class PromotionMenuItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback? onTap;
  final bool isDisabled;

  const PromotionMenuItem({
    super.key,
    required this.icon,
    required this.title,
    this.onTap,
    this.isDisabled = false,
  });

  @override
  Widget build(BuildContext context) {
    final item = ListTile(
      leading: Icon(
        icon,
        color: isDisabled ? Colors.grey[400] : Colors.grey[600],
      ),
      title: Text(
        title,
        style: TextStyle(color: isDisabled ? Colors.grey : null),
      ),
      trailing: const Icon(Icons.chevron_right, color: Colors.grey),
      onTap: isDisabled ? null : onTap,
    );

    return isDisabled ? Opacity(opacity: 0.5, child: item) : item;
  }
}

class PromotionMenuList extends StatelessWidget {
  const PromotionMenuList({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        children: [
          PromotionMenuItem(
            icon: Icons.campaign_outlined,
            title: 'Chương trình',
            onTap: () {
              Navigator.of(context).push(
                PageRouteBuilder(
                  pageBuilder: (context, animation, secondaryAnimation) =>
                      const PromotionListScreen(),
                  transitionsBuilder:
                      (context, animation, secondaryAnimation, child) {
                        const begin = Offset(1.0, 0.0);
                        const end = Offset.zero;
                        const curve = Curves.easeInOut;
                        var tween = Tween(
                          begin: begin,
                          end: end,
                        ).chain(CurveTween(curve: curve));
                        var offsetAnimation = animation.drive(tween);
                        return SlideTransition(
                          position: offsetAnimation,
                          child: child,
                        );
                      },
                  transitionDuration: const Duration(milliseconds: 300),
                ),
              );
            },
          ),
          const Divider(height: 1),
          PromotionMenuItem(
            icon: Icons.event_outlined,
            title: 'Sự kiện',
            isDisabled: true,
          ),
          const Divider(height: 1),
          PromotionMenuItem(
            icon: Icons.videogame_asset_outlined,
            title: 'Game hot nhận thưởng',
            isDisabled: true,
          ),
        ],
      ),
    );
  }
}
