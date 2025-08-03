import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/core/widgets/loading_overlay.dart';
import 'package:home_feel/features/auth/bloc/auth_event.dart';
import 'package:home_feel/features/auth/presentation/screens/login_screen.dart';
import 'package:home_feel/features/auth/presentation/screens/register_screen.dart';
import 'package:home_feel/features/common/bloc/loading_bloc.dart';
import 'package:home_feel/features/home/bloc/home_event.dart';
import 'package:home_feel/features/home/bloc/home_state.dart';
import 'package:home_feel/features/location/presentation/bloc/location_event.dart';
import 'package:home_feel/features/location/presentation/bloc/location_bloc.dart';
import 'package:home_feel/features/profile/presentation/screens/profile_tab.dart';
import '../../bloc/home_bloc.dart';
import '../widgets/homestay_card.dart';
import 'package:home_feel/features/bookings/presentation/screens/bookings_screen.dart';
import 'package:home_feel/features/promotions/presentation/screens/promotions_screen.dart';
import 'package:home_feel/core/services/tab_notifier.dart';
import 'package:get_it/get_it.dart';
import 'package:home_feel/features/auth/bloc/auth_bloc.dart';
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
    context.read<LocationBloc>().add(FetchAllLocationsEvent());
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
              Icon(Icons.flash_on, color: Colors.orange, size: 24),
              Icon(Icons.hotel, color: Colors.orange, size: 24),
              Icon(Icons.local_offer, color: Colors.orange, size: 24),
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
                  selectedItemColor: Color(0xFFFF9800), // cam đậm
                  unselectedItemColor: Color(0xFFBDBDBD), // xám nhạt
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

class HomeScreenBody extends StatelessWidget {
  const HomeScreenBody({super.key});
  @override
  Widget build(BuildContext context) {
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
