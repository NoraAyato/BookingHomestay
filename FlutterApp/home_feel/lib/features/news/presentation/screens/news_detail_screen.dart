import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/core/constants/api.dart';
import '../../data/models/news_detail_model.dart';
import '../bloc/news_bloc.dart';
import '../bloc/news_state.dart';
import '../bloc/news_event.dart';
import 'package:intl/intl.dart';

class NewsDetailScreen extends StatelessWidget {
  const NewsDetailScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.black),
          onPressed: () {
            Navigator.pop(context);
            context.read<NewsBloc>().add(GetAllNewsEvent());
          },
        ),
      ),
      body: BlocBuilder<NewsBloc, NewsState>(
        builder: (context, state) {
          if (state is NewsLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is NewsDetailLoaded) {
            return _buildDetailContent(context, state.newsDetail);
          }

          if (state is NewsError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    state.message,
                    style: TextStyle(color: Colors.grey[600]),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Quay lại'),
                  ),
                ],
              ),
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildDetailContent(BuildContext context, NewsDetailModel news) {
    return CustomScrollView(
      slivers: [
        // App Bar với hình ảnh
        SliverAppBar(
          expandedHeight: 250,
          pinned: true,
          backgroundColor: Colors.white,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
          flexibleSpace: FlexibleSpaceBar(
            background: Image.network(
              ApiConstants.baseUrl + news.hinhAnh,
              fit: BoxFit.cover,
            ),
          ),
        ),
        // Nội dung
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  news.tieuDe,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1A1A1A),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Icon(Icons.access_time, size: 16, color: Colors.grey[500]),
                    const SizedBox(width: 4),
                    Text(
                      DateFormat('dd/MM/yyyy').format(news.ngayDang),
                      style: TextStyle(fontSize: 14, color: Colors.grey[500]),
                    ),
                    const SizedBox(width: 16),
                    Icon(Icons.person, size: 16, color: Colors.grey[500]),
                    const SizedBox(width: 4),
                    Text(
                      news.tacGia,
                      style: TextStyle(fontSize: 14, color: Colors.grey[500]),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Text(
                  news.noiDung,
                  style: const TextStyle(
                    fontSize: 16,
                    height: 1.6,
                    color: Color(0xFF333333),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
