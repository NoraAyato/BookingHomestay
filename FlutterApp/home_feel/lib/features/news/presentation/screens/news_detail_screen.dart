import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/core/constants/api.dart';
import 'package:home_feel/shared/widgets/error_display.dart';
import '../../data/models/news_detail_model.dart';
import '../bloc/news_bloc.dart';
import '../bloc/news_state.dart';
import '../bloc/news_event.dart';
import 'package:intl/intl.dart';

class NewsDetailScreen extends StatelessWidget {
  const NewsDetailScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        context.read<NewsBloc>().add(GetAllNewsEvent());
        return true;
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          automaticallyImplyLeading: false, // Ẩn nút back mặc định
          backgroundColor: Colors.white,
          elevation: 0,
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
                    ErrorDisplay(errorMessage: state.message),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        context.read<NewsBloc>().add(GetAllNewsEvent());
                      },
                      child: const Text('Quay lại'),
                    ),
                  ],
                ),
              );
            }

            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }

  Widget _buildDetailContent(BuildContext context, NewsDetailModel news) {
    return Stack(
      children: [
        CustomScrollView(
          slivers: [
            // App Bar với hình ảnh
            SliverAppBar(
              expandedHeight: 250,
              pinned: true,
              backgroundColor: Colors.white,
              automaticallyImplyLeading: false, // Ẩn nút back mặc định
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
                        Icon(
                          Icons.access_time,
                          size: 16,
                          color: Colors.grey[500],
                        ),
                        const SizedBox(width: 4),
                        Text(
                          DateFormat('dd/MM/yyyy').format(news.ngayDang),
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[500],
                          ),
                        ),
                        const SizedBox(width: 16),
                        Icon(Icons.person, size: 16, color: Colors.grey[500]),
                        const SizedBox(width: 4),
                        Text(
                          news.tacGia,
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[500],
                          ),
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
                    const SizedBox(height: 24),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
          ],
        ),
        // Nút back mũi tên ở góc trên trái
        Positioned(
          top: 40,
          left: 16,
          child: Material(
            color: Colors.black.withOpacity(0.3),
            borderRadius: BorderRadius.circular(20),
            child: InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: () {
                Navigator.pop(context);
                context.read<NewsBloc>().add(GetAllNewsEvent());
              },
              child: Container(
                padding: const EdgeInsets.all(8),
                child: const Icon(
                  Icons.arrow_back,
                  color: Colors.white,
                  size: 22,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
