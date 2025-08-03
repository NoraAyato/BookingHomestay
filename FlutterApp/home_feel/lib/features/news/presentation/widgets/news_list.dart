import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/models/news_model.dart';
import '../bloc/news_bloc.dart';
import '../bloc/news_event.dart';
import '../bloc/news_state.dart';
import 'news_item.dart';

class NewsList extends StatelessWidget {
  final String title;
  final List<NewsModel> news;
  final VoidCallback? onViewAll;

  const NewsList({
    Key? key,
    required this.title,
    required this.news,
    this.onViewAll,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Header với tiêu đề và nút "Xem tất cả"
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              if (onViewAll != null)
                TextButton(
                  onPressed: onViewAll,
                  child: Row(
                    children: const [
                      Text(
                        'Xem tất cả',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      SizedBox(width: 4),
                      Icon(Icons.arrow_forward, size: 16),
                    ],
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        // Danh sách tin tức có thể cuộn ngang
        SizedBox(
          height: 320, // Chiều cao cố định cho container
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: news.length,
            itemBuilder: (context, index) {
              return NewsItem(
                news: news[index],
                onTap: () {
                  // Khi tap vào item, dispatch event để xem chi tiết
                  context.read<NewsBloc>().add(
                    GetNewsDetailEvent(news[index].maTinTuc),
                  );
                  // TODO: Navigate to detail screen
                },
              );
            },
          ),
        ),
      ],
    );
  }
}
