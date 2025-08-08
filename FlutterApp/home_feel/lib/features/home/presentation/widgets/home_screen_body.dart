import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/shared/widgets/error_display.dart';
import 'home_app_bar.dart';
import 'homestay_list.dart';
import 'suggestion_list.dart';
import 'package:home_feel/features/news/presentation/bloc/news_bloc.dart';
import 'package:home_feel/features/news/presentation/bloc/news_event.dart';
import 'package:home_feel/features/news/presentation/bloc/news_state.dart';
import 'package:home_feel/features/news/presentation/widgets/news_card.dart';
import 'package:home_feel/features/news/presentation/screens/news_detail_screen.dart';
import 'package:home_feel/features/home/presentation/bloc/home_bloc.dart';
import 'package:home_feel/features/home/presentation/bloc/home_event.dart';

class HomeScreenBody extends StatefulWidget {
  const HomeScreenBody({super.key});

  @override
  State<HomeScreenBody> createState() => _HomeScreenBodyState();
}

class _HomeScreenBodyState extends State<HomeScreenBody>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    _loadNews();
  }

  void _loadNews() {
    if (mounted) {
      context.read<NewsBloc>().add(GetAllNewsEvent());
    }
  }

  void _loadHomestay() {
    if (mounted) {
      context.read<HomeBloc>().add(FetchHomestaysEvent());
    }
  }

  Future<void> _handleRefresh() async {
    // Simulate a network call or data refresh
    await Future.delayed(const Duration(seconds: 2));

    // Reload news data
    _loadNews();

    // Reload homestay data
    _loadHomestay();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _loadNews();
    _loadHomestay();
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(110),
        child: const HomeAppBar(),
      ),
      body: RefreshIndicator(
        onRefresh: _handleRefresh,
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16.0),
                child: Text(
                  'Danh sách homestay',
                  style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 8.0),
              const HomestayList(),
              const SizedBox(height: 24),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16.0),
                child: Text(
                  'Gợi ý hôm nay',
                  style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 8.0),
              const SuggestionList(),
              const SizedBox(height: 24),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16.0),
                child: Text(
                  'Lời khuyên cần biết',
                  style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 8.0),
              BlocBuilder<NewsBloc, NewsState>(
                builder: (context, state) {
                  if (state is NewsLoading) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  if (state is NewsLoaded) {
                    if (state.news.isEmpty) {
                      return const Center(child: Text('Không có tin tức nào'));
                    }

                    return SizedBox(
                      height: 280,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: state.news.length,
                        itemBuilder: (context, index) {
                          return NewsCard(
                            news: state.news[index],
                            onTap: () {
                              context.read<NewsBloc>().add(
                                GetNewsDetailEvent(state.news[index].maTinTuc),
                              );
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => BlocProvider.value(
                                    value: context.read<NewsBloc>(),
                                    child: const NewsDetailScreen(),
                                  ),
                                  maintainState: true,
                                ),
                              ).then((_) {
                                if (mounted) {
                                  // Fetch lại data khi quay về
                                  Future.microtask(() {
                                    context.read<NewsBloc>().add(
                                      const GetAllNewsEvent(refresh: true),
                                    );
                                  });
                                }
                              });
                            },
                          );
                        },
                      ),
                    );
                  }

                  if (state is NewsError) {
                    return ErrorDisplay(errorMessage: state.message);
                  }

                  return const SizedBox.shrink();
                },
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
