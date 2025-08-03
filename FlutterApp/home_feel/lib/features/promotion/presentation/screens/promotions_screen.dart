import 'package:flutter/material.dart';
import 'package:home_feel/features/promotion/presentation/widgets/promotion_banner.dart';
import 'package:home_feel/features/promotion/presentation/widgets/promotion_menu_list.dart';
import 'package:home_feel/features/promotion/presentation/widgets/promotion_statistics.dart';

class PromotionsScreen extends StatelessWidget {
  const PromotionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: const [
              PromotionStatistics(),
              SizedBox(height: 24),
              PromotionBanner(),
              PromotionMenuList(),
            ],
          ),
        ),
      ),
    );
  }
}
