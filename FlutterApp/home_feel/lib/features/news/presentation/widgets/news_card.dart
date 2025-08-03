import 'package:flutter/material.dart';
import 'package:home_feel/core/constants/api.dart';
import 'package:intl/intl.dart';
import '../../data/models/news_model.dart';

class NewsCard extends StatelessWidget {
  final NewsModel news;
  final VoidCallback? onTap;

  const NewsCard({Key? key, required this.news, this.onTap}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final fullImageUrl = '${ApiConstants.baseUrl}${news.hinhAnh}';

    return GestureDetector(
      onTap: onTap,
      child: SizedBox(
        width: 280,
        height: 240,
        child: Card(
          elevation: 3,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Hình ảnh
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    fullImageUrl,
                    height: 160,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      height: 160,
                      color: Colors.grey[200],
                      child: const Icon(Icons.image_not_supported, size: 40),
                    ),
                  ),
                ),
                const SizedBox(height: 8),

                // Tiêu đề
                Text(
                  news.tieuDe,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),

                // Nội dung rút gọn
                Text(
                  news.noiDung,
                  style: const TextStyle(fontSize: 14, color: Colors.grey),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),

                const SizedBox(height: 22),

                // Thông tin thêm
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Tác giả
                    Expanded(
                      child: Text(
                        news.tacGia,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    // Ngày đăng
                    Text(
                      DateFormat('dd/MM/yyyy').format(news.ngayDang),
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
