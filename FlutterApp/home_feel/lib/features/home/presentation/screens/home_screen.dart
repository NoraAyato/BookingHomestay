import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/core/widgets/loading_overlay.dart';
import 'package:home_feel/features/auth/bloc/auth_event.dart';
import 'package:home_feel/features/auth/presentation/screens/login_screen.dart';
import 'package:home_feel/features/auth/presentation/screens/register_screen.dart';
import 'package:home_feel/features/common/bloc/loading_bloc.dart';
import 'package:home_feel/features/home/presentation/bloc/home_bloc.dart';
import 'package:home_feel/features/home/presentation/bloc/home_event.dart';
import 'package:home_feel/features/home/presentation/bloc/home_state.dart';
import 'package:home_feel/features/profile/presentation/screens/profile_tab.dart';
import '../widgets/homestay_card.dart';
import 'package:home_feel/features/bookings/presentation/screens/bookings_screen.dart';
import 'package:home_feel/features/promotion/presentation/screens/promotions_screen.dart';
import 'package:home_feel/core/services/tab_notifier.dart';
import 'package:get_it/get_it.dart';
import 'package:home_feel/features/auth/bloc/auth_bloc.dart';
import 'package:home_feel/features/news/presentation/bloc/news_bloc.dart';
import 'package:home_feel/features/news/presentation/bloc/news_event.dart';
import 'package:home_feel/features/news/presentation/bloc/news_state.dart';
import 'package:home_feel/features/news/presentation/screens/news_detail_screen.dart';
import 'package:home_feel/features/news/presentation/widgets/news_card.dart';
import '../widgets/home_app_bar.dart';
import '../widgets/search_bar.dart';
import '../widgets/homestay_list.dart';
import '../widgets/suggestion_list.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  bool _showOverlay = false;
  int? _overlayScreen; // null: không overlay, 0: login, 1: register
  final tabNotifier = GetIt.I<TabNotifier>();
  // LoadingBloc cho overlay loading
  final _loadingBloc = GetIt.I<LoadingBloc>();

  void showLogin() => setState(() {
    _showOverlay = true;
    _overlayScreen = 0;
  });
  void showRegister() => setState(() {
    _showOverlay = true;
    _overlayScreen = 1;
  });
  void closeOverlay() => setState(() {
    _showOverlay = false;
    _overlayScreen = null;
  });

  List<Widget> get _screens => [
    const HomeScreenBody(),
    const PlaceholderWidget(title: 'Đề xuất'),
    const BookingsScreen(),
    const PromotionsScreen(),
    ProfileTab(onLogin: showLogin),
  ];

  @override
  void initState() {
    super.initState();
    tabNotifier.addListener(_onTabChanged);
  }

  void _onTabChanged() {
    setState(() {
      _currentIndex = tabNotifier.value;
    });
  }

  @override
  void dispose() {
    tabNotifier.removeListener(_onTabChanged);
    super.dispose();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Gọi event khi context đã sẵn sàng

    context.read<HomeBloc>().add(FetchHomestaysEvent());
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LoadingBloc, LoadingState>(
      bloc: _loadingBloc,
      builder: (context, loadingState) {
        return Scaffold(
          body: LoadingOverlay(
            isLoading: loadingState.isLoading,
            icons: [
              const Icon(Icons.flash_on, color: Colors.orange, size: 24),
              const Icon(Icons.hotel, color: Colors.orange, size: 24),
              const Icon(Icons.local_offer, color: Colors.orange, size: 24),
            ],
            child: Stack(
              children: [
                _screens[_currentIndex],
                if (_showOverlay && _overlayScreen == 0)
                  Positioned.fill(
                    child: LoginScreen(
                      onClose: closeOverlay,
                      onRegister: showRegister,
                    ),
                  ),
                if (_showOverlay && _overlayScreen == 1)
                  Positioned.fill(
                    child: RegisterScreen(
                      onClose: closeOverlay,
                      onLogin: showLogin,
                    ),
                  ),
              ],
            ),
          ),
          bottomNavigationBar: _showOverlay
              ? null
              : BottomNavigationBar(
                  type: BottomNavigationBarType.fixed,
                  backgroundColor: const Color(0xFFFFF3E0), // cam nhạt
                  selectedItemColor: const Color(0xFFFF9800), // cam đậm
                  unselectedItemColor: const Color(0xFFBDBDBD), // xám nhạt
                  selectedLabelStyle: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 11,
                  ),
                  unselectedLabelStyle: const TextStyle(
                    fontWeight: FontWeight.w400,
                    fontSize: 11,
                  ),
                  items: const [
                    BottomNavigationBarItem(
                      icon: Icon(Icons.home),
                      label: 'Trang chủ',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.thumb_up_alt),
                      label: 'Đề xuất',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.book),
                      label: 'Phòng đã đặt',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.local_offer),
                      label: 'Ưu đãi',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.person),
                      label: 'Tài khoản',
                    ),
                  ],
                  currentIndex: _currentIndex,
                  onTap: (index) {
                    setState(() {
                      _currentIndex = index;
                    });
                    tabNotifier.value = index;
                  },
                ),
        );
      },
    );
  }
}

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

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _loadNews();
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(110),
        child: const HomeAppBar(),
      ),
      body: SingleChildScrollView(
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
                                    GetAllNewsEvent(),
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
                  return Center(child: Text(state.message));
                }

                return const SizedBox.shrink();
              },
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}

class PlaceholderWidget extends StatelessWidget {
  final String title;
  const PlaceholderWidget({super.key, required this.title});
  @override
  Widget build(BuildContext context) {
    return Center(child: Text(title));
  }
}
