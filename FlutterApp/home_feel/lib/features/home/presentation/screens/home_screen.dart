import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:home_feel/features/home/bloc/home_event.dart';
import 'package:home_feel/features/home/bloc/home_state.dart';
import 'package:home_feel/features/home/bloc/location_event.dart';
import 'package:home_feel/features/home/bloc/location_state.dart';
import '../../bloc/home_bloc.dart';
import '../../bloc/location_bloc.dart';
import '../widgets/homestay_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String? selectedLocationId;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Gọi event khi context đã sẵn sàng
    context.read<LocationBloc>().add(FetchLocationsEvent());
    context.read<HomeBloc>().add(FetchHomestaysEvent());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.orange[100],
        toolbarHeight: 110.0,
        flexibleSpace: Padding(
          padding: const EdgeInsets.only(
            top: 25.0,
          ), //khoảng cách từ appbar tới các item
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Phần tiêu đề và nút thông báo
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
              // Ô tìm kiếm
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16.0,
                  vertical: 1.0,
                ),
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
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 12.0,
                      vertical: 3.0,
                    ),
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
                      // Section 1
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
                        height:
                            220, // tùy chỉnh chiều cao tùy theo HomestayCard
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          itemCount: state.homestays.length,
                          itemBuilder: (context, index) {
                            return Padding(
                              padding: const EdgeInsets.only(right: 12.0),
                              child: SizedBox(
                                width: 250, // chiều rộng của mỗi card ngang
                                child: HomestayCard(
                                  homestay: state.homestays[index],
                                ),
                              ),
                            );
                          },
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Bạn có thể lặp lại Section 2 tương tự nếu cần
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
            return Center(child: Text('Lỗi: ${state.message}'));
          }
          return const Center(child: Text('Đang tải dữ liệu...'));
        },
      ),

      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Trang chủ'),
          BottomNavigationBarItem(icon: Icon(Icons.star), label: 'Đánh giá'),
          BottomNavigationBarItem(
            icon: Icon(Icons.book),
            label: 'Phòng đã đặt',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.local_offer),
            label: 'Ưu đãi',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Tài khoản'),
        ],
        currentIndex: 0,
        selectedItemColor: Colors.orange,
        unselectedItemColor: Colors.grey,
        onTap: (index) {
          // Xử lý chuyển tab
        },
      ),
    );
  }
}
