import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/shared/widgets/error_display.dart';
import '../bloc/news_bloc.dart';
import '../bloc/news_event.dart';
import '../bloc/news_state.dart';
import '../widgets/news_card.dart';
import 'news_detail_screen.dart';

class NewsScreen extends StatefulWidget {
  const NewsScreen({Key? key}) : super(key: key);

  @override
  State<NewsScreen> createState() => _NewsScreenState();
}

class _NewsScreenState extends State<NewsScreen> {
  @override
  void initState() {
    super.initState();
    // Fetch news when screen loads
    context.read<NewsBloc>().add(GetAllNewsEvent());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<NewsBloc, NewsState>(
        builder: (context, state) {
          if (state is NewsLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is NewsError) {
            return ErrorDisplay(errorMessage: state.message);
          }

          if (state is NewsLoaded) {
            return RefreshIndicator(
              onRefresh: () async {
                context.read<NewsBloc>().add(
                  const GetAllNewsEvent(refresh: true),
                );
              },
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(vertical: 8),
                itemCount: state.news.length,
                itemBuilder: (context, index) {
                  return NewsCard(
                    news: state.news[index],
                    onTap: () {
                      // Dispatch event để lấy chi tiết tin tức
                      context.read<NewsBloc>().add(
                        GetNewsDetailEvent(state.news[index].maTinTuc),
                      );

                      // Navigate to detail screen
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => BlocProvider.value(
                            value: BlocProvider.of<NewsBloc>(context),
                            child: const NewsDetailScreen(),
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }
}
