import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/features/auth/presentation/screens/login_screen.dart';
import 'package:home_feel/features/auth/presentation/screens/register_screen.dart';
import 'package:home_feel/features/home/bloc/home_event.dart';
import 'package:home_feel/features/home/bloc/home_state.dart';
import 'package:home_feel/features/home/bloc/location_event.dart';
import 'package:home_feel/features/profile/presentation/screens/profile_tab.dart';
import '../../bloc/home_bloc.dart';
import '../../bloc/location_bloc.dart';
import '../widgets/homestay_card.dart';
import 'package:home_feel/features/bookings/presentation/screens/bookings_screen.dart';
import 'package:home_feel/features/promotions/presentation/screens/promotions_screen.dart';
import 'package:home_feel/core/services/tab_notifier.dart';
import 'package:get_it/get_it.dart';
import 'package:home_feel/features/auth/bloc/auth_bloc.dart';

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

  void showLogin() => setState(() { _showOverlay = true; _overlayScreen = 0; });
  void showRegister() => setState(() { _showOverlay = true; _overlayScreen = 1; });
  void closeOverlay() => setState(() { _showOverlay = false; _overlayScreen = null; });

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
    context.read<LocationBloc>().add(FetchLocationsEvent());
    context.read<HomeBloc>().add(FetchHomestaysEvent());
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<HomeBloc>(
          create: (context) => GetIt.I<HomeBloc>(),
        ),
        BlocProvider<LocationBloc>(
          create: (context) => GetIt.I<LocationBloc>(),
        ),
        BlocProvider<AuthBloc>(
          create: (context) => GetIt.I<AuthBloc>(),
        ),
      ],
      child: Scaffold(
        body: Stack(
          children: [
            _screens[_currentIndex],
            if (_showOverlay && _overlayScreen == 0)
              Positioned.fill(
                child: LoginScreen(onClose: closeOverlay, onRegister: showRegister),
              ),
            if (_showOverlay && _overlayScreen == 1)
              Positioned.fill(
                child: RegisterScreen(onClose: closeOverlay, onLogin: showLogin),
              ),
          ],
        ),
        bottomNavigationBar: _showOverlay ? null : BottomNavigationBar(
          type: BottomNavigationBarType.fixed,
          backgroundColor: const Color(0xFFFFF3E0), // cam nhạt
          selectedItemColor: Color(0xFFFF9800), // cam đậm
          unselectedItemColor: Color(0xFFBDBDBD), // xám nhạt
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 11),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w400, fontSize: 11),
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
      ),
    );
  }
}

class HomeScreenBody extends StatelessWidget {
  const HomeScreenBody({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.orange[100],
        toolbarHeight: 110.0,
        flexibleSpace: Padding(
          padding: const EdgeInsets.only(top: 25.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Khám phá khách sạn và ưu đãi tại đây',
                      style: TextStyle(fontSize: 13),
                    ),
                    IconButton(
                      icon: const Icon(
                        Icons.notifications,
                        color: Colors.red,
                        size: 23.0,
                      ),
                      onPressed: () {},
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 1.0),
                child: TextField(
                  readOnly: true,
                  showCursor: false,
                  decoration: InputDecoration(
                    hintText: 'Tên khách sạn, huyện/quận',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(25.0),
                      borderSide: BorderSide.none,
                    ),
                    filled: true,
                    fillColor: Colors.white,
                    prefixIcon: const Icon(
                      Icons.search,
                      color: Colors.orange,
                      size: 16.0,
                    ),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 3.0),
                  ),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Mở màn hình tìm kiếm')),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
      body: BlocBuilder<HomeBloc, HomeState>(
        builder: (context, state) {
          if (state is HomeLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is HomeLoaded) {
            return SafeArea(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 16.0),
                        child: Text(
                          'Danh sách homestay',
                          style: TextStyle(
                            fontSize: 16.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8.0),
                      SizedBox(
                        height: 220,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          itemCount: state.homestays.length,
                          itemBuilder: (context, index) {
                            return Padding(
                              padding: const EdgeInsets.only(right: 12.0),
                              child: SizedBox(
                                width: 250,
                                child: HomestayCard(
                                  homestay: state.homestays[index],
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(height: 24),
                      const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 16.0),
                        child: Text(
                          'Gợi ý hôm nay',
                          style: TextStyle(
                            fontSize: 16.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8.0),
                      SizedBox(
                        height: 220,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          itemCount: state.homestays.length,
                          itemBuilder: (context, index) {
                            return Padding(
                              padding: const EdgeInsets.only(right: 12.0),
                              child: SizedBox(
                                width: 250,
                                child: HomestayCard(
                                  homestay: state.homestays[index],
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),
            );
          } else if (state is HomeError) {
            return Center(child: Text('Lỗi:  {state.message}'));
          }
          return const Center(child: Text('Đang tải dữ liệu...'));
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
