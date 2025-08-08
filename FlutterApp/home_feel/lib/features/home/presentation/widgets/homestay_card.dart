import 'package:flutter/material.dart';
import 'package:home_feel/core/constants/api.dart';
import '../../data/models/homestay_model.dart';

class HomestayCard extends StatelessWidget {
  final HomestayModel homestay;

  const HomestayCard({super.key, required this.homestay});

  @override
  Widget build(BuildContext context) {
    final fullImageUrl = '${ApiConstants.baseUrl}${homestay.hinhAnh}';

    return SizedBox(
      width: 240,
      height: 220, // 👈 Giới hạn chiều cao để tránh overflow
      child: Card(
        elevation: 3,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Ảnh
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  fullImageUrl,
                  height: 100, 
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(
                    height: 100,
                    color: Colors.grey[200],
                    child: const Icon(Icons.image_not_supported, size: 40),
                  ),
                ),
              ),
              const SizedBox(height: 6),

              // Tên homestay
              Text(
                homestay.tenHomestay,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),

              // Địa chỉ
              Text(
                homestay.diaChi,
                style: const TextStyle(fontSize: 12, color: Colors.grey),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),

              const SizedBox(height: 4),

              // Giá + Đánh giá
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Giá: \$${homestay.pricePerNight.toStringAsFixed(2)}',
                    style: const TextStyle(fontSize: 12),
                  ),
                  Row(
                    children: [
                      const Icon(Icons.star, size: 14, color: Colors.amber),
                      Text(
                        homestay.hang.toStringAsFixed(1),
                        style: const TextStyle(fontSize: 12),
                      ),
                    ],
                  ),
                ],
              ),

              // Giảm giá
              if (homestay.hasDiscount)
                Padding(
                  padding: const EdgeInsets.only(top: 4.0),
                  child: Text(
                    '${homestay.discountPercentage}% OFF',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.red,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
