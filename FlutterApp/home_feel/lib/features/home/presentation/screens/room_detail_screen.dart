import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/core/constants/api.dart';
import 'package:home_feel/features/home/data/models/room_detail_model.dart';
import 'package:home_feel/features/home/data/models/room_images_model.dart';
import 'package:home_feel/features/home/presentation/bloc/home_bloc.dart';
import 'package:home_feel/features/home/presentation/bloc/home_event.dart';
import 'package:home_feel/features/home/presentation/bloc/home_state.dart';
import 'package:home_feel/shared/widgets/error_display.dart';
import 'package:intl/intl.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class RoomDetailScreen extends StatefulWidget {
  final String maPhong;
  final DateTime checkIn;
  final DateTime checkOut;
  final String checkInTime;
  final String checkOutTime;

  const RoomDetailScreen({
    Key? key,
    required this.maPhong,
    required this.checkIn,
    required this.checkOut,
    required this.checkInTime,
    required this.checkOutTime,
  }) : super(key: key);

  @override
  State<RoomDetailScreen> createState() => _RoomDetailScreenState();
}

class _RoomDetailScreenState extends State<RoomDetailScreen> {
  final PageController _pageController = PageController();
  int _currentImageIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadRoomData();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _loadRoomData() {
    // Gửi các event để lấy thông tin phòng và ảnh phòng
    final bloc = context.read<HomeBloc>();
    bloc.add(GetRoomDetailEvent(widget.maPhong));
    bloc.add(GetRoomImagesEvent(widget.maPhong));
  }

  int _calculateNights() {
    return widget.checkOut.difference(widget.checkIn).inDays + 1;
  }

  String _formatDate(DateTime date) {
    return DateFormat('dd/MM/yyyy').format(date);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Chi tiết phòng'), elevation: 0),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.only(bottom: 80),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Hiển thị ảnh phòng
                _buildRoomImagesSection(),

                // Thông tin chi tiết phòng
                _buildRoomDetailSection(),

                // Thông tin ngày nhận phòng
                _buildBookingInfoSection(),

                // Chính sách phòng
                _buildPolicySection(),
              ],
            ),
          ),

          // Thanh đặt phòng ở dưới cùng
          Positioned(left: 0, right: 0, bottom: 0, child: _buildBookingBar()),
        ],
      ),
    );
  }

  Widget _buildRoomImagesSection() {
    return BlocBuilder<HomeBloc, HomeState>(
      buildWhen: (prev, curr) =>
          curr is HomeRoomImagesLoading ||
          curr is HomeRoomImagesLoaded ||
          curr is HomeRoomImagesError,
      builder: (context, state) {
        if (state is HomeRoomImagesLoading) {
          return const SizedBox(
            height: 250,
            child: Center(child: CircularProgressIndicator()),
          );
        } else if (state is HomeRoomImagesLoaded) {
          final images = state.images;
          if (images.urlAnhs.isEmpty) {
            return const SizedBox(
              height: 250,
              child: Center(child: Text('Không có ảnh cho phòng này')),
            );
          }

          return Column(
            children: [
              SizedBox(
                height: 250,
                child: PageView.builder(
                  controller: _pageController,
                  itemCount: images.urlAnhs.length,
                  onPageChanged: (index) {
                    setState(() {
                      _currentImageIndex = index;
                    });
                  },
                  itemBuilder: (context, index) {
                    return GestureDetector(
                      onTap: () {
                        showDialog(
                          context: context,
                          builder: (_) => Dialog(
                            backgroundColor: Colors.transparent,
                            child: GestureDetector(
                              onTap: () => Navigator.of(context).pop(),
                              child: InteractiveViewer(
                                child: Image.network(
                                  ApiConstants.baseUrl + images.urlAnhs[index],
                                  fit: BoxFit.contain,
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                      child: Container(
                        width: MediaQuery.of(context).size.width,
                        decoration: BoxDecoration(
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.08),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Image.network(
                          ApiConstants.baseUrl + images.urlAnhs[index],
                          fit: BoxFit.cover,
                          loadingBuilder: (context, child, progress) {
                            if (progress == null) return child;
                            return const Center(
                              child: CircularProgressIndicator(),
                            );
                          },
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 8),
              AnimatedSmoothIndicator(
                activeIndex: _currentImageIndex,
                count: images.urlAnhs.length,
                effect: WormEffect(
                  dotHeight: 8,
                  dotWidth: 8,
                  activeDotColor: Theme.of(context).primaryColor,
                  dotColor: Colors.grey.shade300,
                ),
              ),
            ],
          );
        } else if (state is HomeRoomImagesError) {
          return SizedBox(
            height: 250,
            child: ErrorDisplay(errorMessage: state.message),
          );
        }
        return const SizedBox(height: 250);
      },
    );
  }

  Widget _buildRoomDetailSection() {
    return BlocBuilder<HomeBloc, HomeState>(
      buildWhen: (prev, curr) =>
          curr is HomeRoomDetailLoading ||
          curr is HomeRoomDetailLoaded ||
          curr is HomeRoomDetailError,
      builder: (context, state) {
        if (state is HomeRoomDetailLoading) {
          return const Center(
            child: Padding(
              padding: EdgeInsets.all(20.0),
              child: CircularProgressIndicator(),
            ),
          );
        } else if (state is HomeRoomDetailLoaded) {
          final roomDetail = state.roomDetail;
          return Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  roomDetail.tenPhong,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),

                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.orange.shade100,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        roomDetail.tenLoai,
                        style: TextStyle(
                          color: Colors.orange.shade900,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // Giá phòng và số người
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Giá phòng
                    Row(
                      children: [
                        const Icon(
                          Icons.attach_money,
                          color: Colors.green,
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Giá: ${NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(roomDetail.donGia).replaceAll('.', ',')}',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),

                    // Số người
                    Row(
                      children: [
                        Icon(
                          Icons.people,
                          color: Colors.blue.shade700,
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '${roomDetail.soNguoi} người',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                const Divider(height: 24),

                // Chính sách nhận/trả phòng
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Chính sách phòng:',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    _buildPolicyItem(
                      Icons.login,
                      'Nhận phòng: ${roomDetail.nhanPhong}',
                    ),
                    const SizedBox(height: 8),
                    _buildPolicyItem(
                      Icons.logout,
                      'Trả phòng: ${roomDetail.traPhong}',
                    ),
                    const SizedBox(height: 8),
                    _buildPolicyItem(
                      Icons.cancel_outlined,
                      'Hủy phòng: ${roomDetail.huyPhong}',
                    ),
                  ],
                ),
              ],
            ),
          );
        } else if (state is HomeRoomDetailError) {
          return Padding(
            padding: const EdgeInsets.all(16.0),
            child: ErrorDisplay(errorMessage: state.message),
          );
        }
        return const SizedBox.shrink();
      },
    );
  }

  Widget _buildBookingInfoSection() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Thông tin đặt phòng',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Nhận phòng',
                        style: TextStyle(color: Colors.grey, fontSize: 14),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _formatDate(widget.checkIn),
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        widget.checkInTime,
                        style: const TextStyle(fontSize: 14),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const Icon(Icons.calendar_today, color: Colors.blue),
                      Text(
                        '${_calculateNights()} ngày',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Trả phòng',
                        style: TextStyle(color: Colors.grey, fontSize: 14),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _formatDate(widget.checkOut),
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        widget.checkOutTime,
                        style: const TextStyle(fontSize: 14),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPolicySection() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Quy định và chính sách',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          _buildPolicyItem(
            Icons.verified_user,
            'Nhận phòng bằng CCCD/CMND/Hộ chiếu',
          ),
          const SizedBox(height: 8),
          _buildPolicyItem(Icons.smoke_free, 'Không hút thuốc trong phòng'),
          const SizedBox(height: 8),
          _buildPolicyItem(
            Icons.credit_card,
            'Thanh toán trước khi nhận phòng',
          ),
          const SizedBox(height: 8),
          _buildPolicyItem(Icons.pets, 'Không mang thú cưng'),
        ],
      ),
    );
  }

  Widget _buildBookingBar() {
    return BlocBuilder<HomeBloc, HomeState>(
      buildWhen: (prev, curr) => curr is HomeRoomDetailLoaded,
      builder: (context, state) {
        double totalPrice = 0;
        if (state is HomeRoomDetailLoaded) {
          totalPrice = state.roomDetail.donGia * _calculateNights();
        }

        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 4,
                offset: const Offset(0, -2),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Tổng giá',
                    style: TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                  Text(
                    NumberFormat.currency(
                      locale: 'vi_VN',
                      symbol: 'đ',
                    ).format(totalPrice).replaceAll('.', ','),
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    'cho ${_calculateNights()} ngày',
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
              ElevatedButton(
                onPressed: () {
                  // Chuyển đến màn hình đặt phòng
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepOrange,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 12,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                ),
                child: const Text(
                  'Đặt phòng ngay',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPolicyItem(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 18, color: Colors.grey.shade700),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: TextStyle(fontSize: 14, color: Colors.grey.shade800),
          ),
        ),
      ],
    );
  }
}
