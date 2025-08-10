import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:home_feel/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_state.dart';
import 'package:home_feel/shared/bloc/loading/loading_bloc.dart';
import 'package:home_feel/shared/bloc/loading/loading_state.dart';
import 'package:home_feel/core/services/auth/login_service.dart';

import 'package:home_feel/features/profile/presentation/screens/profile_tab.dart';

import 'package:home_feel/features/bookings/presentation/screens/bookings_screen.dart';
import 'package:home_feel/features/promotion/presentation/screens/promotions_screen.dart';
import 'package:home_feel/core/services/tab_notifier.dart';
import 'package:get_it/get_it.dart';
import 'package:home_feel/shared/presentation/widgets/loading_overlay.dart';

import '../widgets/home_screen_body.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  bool _showOverlay = false; // Giữ lại để điều khiển thanh điều hướng dưới cùng
  final tabNotifier = GetIt.I<TabNotifier>();
  // LoadingBloc cho overlay loading
  final _loadingBloc = GetIt.I<LoadingBloc>();

  void showLogin() => setState(() {
    // Sử dụng LoginService thay vì hiển thị login overlay
    LoginService.showLoginOverlay(context);
  });
  void showRegister() => setState(() {
    // Không cần thiết lập state khi dùng LoginService
    // Đặt RegisterScreen sẽ được xử lý trong LoginService
    LoginService.showLoginOverlay(context);
  });
  void closeOverlay() => setState(() {
    _showOverlay = false;
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
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthRequiresLogin) {
          // Hiển thị màn hình đăng nhập khi trạng thái là AuthRequiresLogin
          LoginService.showLoginOverlay(context);
        }
      },
      child: BlocBuilder<LoadingBloc, LoadingState>(
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
                  // Các overlay đã được thay thế bằng LoginService
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
