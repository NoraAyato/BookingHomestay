import 'package:flutter/material.dart';
import 'package:home_feel/features/promotion/presentation/widgets/promotion_statistics_item.dart';

class PromotionStatistics extends StatelessWidget {
  const PromotionStatistics({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Ưu đãi độc quyền',
            style: Theme.of(
              context,
            ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Expanded(
                child: PromotionStatisticsItem(
                  value: '1',
                  label: 'Ưu đãi',
                  icon: Icons.confirmation_number_outlined,
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: PromotionStatisticsItem(
                  value: '',
                  label: 'Joy Xu',
                  icon: Icons.credit_card_outlined,
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: PromotionStatisticsItem(
                  value: '',
                  label: 'Tem',
                  icon: Icons.local_offer_outlined,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
