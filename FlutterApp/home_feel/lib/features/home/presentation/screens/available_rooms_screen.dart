import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/core/constants/api.dart';
import 'package:home_feel/features/home/presentation/bloc/home_bloc.dart';
import 'package:home_feel/features/home/presentation/bloc/home_event.dart';
import 'package:home_feel/features/home/presentation/bloc/home_state.dart';
import 'package:home_feel/features/home/data/models/available_room_model.dart';
import 'package:home_feel/features/home/data/models/room_images_model.dart';
import 'package:home_feel/features/home/presentation/screens/room_detail_screen.dart';
import 'package:home_feel/shared/widgets/error_display.dart';
import 'package:intl/intl.dart';

import 'dart:async';

class AvailableRoomsScreen extends StatefulWidget {
  final String homestayId;
  final DateTime checkIn;
  final DateTime checkOut;
  final String checkInTime;
  final String checkOutTime;
  const AvailableRoomsScreen({
    Key? key,
    required this.homestayId,
    required this.checkIn,
    required this.checkOut,
    required this.checkInTime,
    required this.checkOutTime,
  }) : super(key: key);

  @override
  State<AvailableRoomsScreen> createState() => _AvailableRoomsScreenState();
}

class _AvailableRoomsScreenState extends State<AvailableRoomsScreen> {
  final Map<String, RoomImagesModel?> _roomImagesCache = {};
  bool _isLoadingRooms = true;
  List<AvailableRoomModel> _rooms = [];
  String? _error;

  @override
  void initState() {
    super.initState();
    _onGetAvailableRooms();
  }

  void _onGetAvailableRooms() {
    setState(() {
      _isLoadingRooms = true;
      _error = null;
    });

    final bloc = context.read<HomeBloc>();
    late StreamSubscription<HomeState> subscription;
    subscription = bloc.stream.listen((state) {
      if (state is HomeAvailableRoomsLoaded) {
        setState(() {
          _rooms = state.rooms;
          _isLoadingRooms = false;
        });
        // Pre-fetch images for all rooms
        for (final room in _rooms) {
          _onGetRoomImages(room.maPhong);
        }
        subscription.cancel();
      } else if (state is HomeAvailableRoomsError) {
        setState(() {
          _error = state.message;
          _isLoadingRooms = false;
        });
        subscription.cancel();
      }
    });

    bloc.add(
      GetAvailableRoomsEvent(
        homestayId: widget.homestayId,
        checkIn: widget.checkIn,
        checkOut: widget.checkOut,
      ),
    );
  }

  void _onGetRoomImages(String maPhong) {
    if (_roomImagesCache.containsKey(maPhong)) {
      return; // Already loaded or loading
    }

    _roomImagesCache[maPhong] = null; // Mark as loading
    final bloc = context.read<HomeBloc>();
    late StreamSubscription<HomeState> subscription;
    subscription = bloc.stream.listen((state) {
      if (state is HomeRoomImagesLoaded && state.images.maPhong == maPhong) {
        setState(() {
          _roomImagesCache[maPhong] = state.images;
        });
        subscription.cancel();
      } else if (state is HomeRoomImagesError) {
        // Keep null in cache to indicate error
        subscription.cancel();
      }
    });

    bloc.add(GetRoomImagesEvent(maPhong));
  }

  PreferredSizeWidget _buildAppBar() {
    final difference = widget.checkOut.difference(widget.checkIn).inDays + 1;
    final daysText = difference == 1
        ? '01 ngày'
        : difference < 10
        ? '0$difference ngày'
        : '$difference ngày';

    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      leading: const BackButton(color: Colors.black54),
      title: const Text(
        'Danh sách phòng',
        style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold),
      ),
      centerTitle: true,
    );
  }

  Widget _buildRoomItem(AvailableRoomModel room) {
    // Tính số ngày lưu trú để tính tổng tiền - cộng thêm 1 để chính xác
    final difference = widget.checkOut.difference(widget.checkIn).inDays + 1;
    final totalPrice = room.giaTien * difference;

    final roomImages = _roomImagesCache[room.maPhong];
    final isLoading =
        !_roomImagesCache.containsKey(room.maPhong) || roomImages == null;

    Widget imageWidget;
    if (isLoading) {
      imageWidget = const SizedBox(
        height: 180,
        child: Center(child: CircularProgressIndicator()),
      );
    } else if (roomImages.urlAnhs.isNotEmpty) {
      imageWidget = SizedBox(
        height: 180,
        child: PageView(
          children: roomImages.urlAnhs
              .map(
                (url) => Image.network(
                  ApiConstants.baseUrl + url,
                  fit: BoxFit.cover,
                  width: double.infinity,
                ),
              )
              .toList(),
        ),
      );
    } else {
      imageWidget = const SizedBox(
        height: 180,
        child: Center(child: Text('Không có ảnh phòng')),
      );
    }

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.2),
            spreadRadius: 1,
            blurRadius: 3,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Phần hình ảnh
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
            child: imageWidget,
          ),

          // Phần tên phòng
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: Text(
              room.tenPhong,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
          ),

          // Đường kẻ ngăn cách
          Divider(
            height: 1,
            thickness: 1,
            color: Colors.grey.shade200,
            indent: 16,
            endIndent: 16,
          ),

          // Phần giá và nút đặt phòng cùng một hàng
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Giá phòng
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 2),
                    Text(
                      NumberFormat.currency(
                        locale: 'vi_VN',
                        symbol: 'đ',
                      ).format(totalPrice).replaceAll('.', ','),
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                ),

                // Nút đặt phòng
                ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepOrange,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 32,
                      vertical: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  child: const Text(
                    'Đặt phòng',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Phần chính sách (giữ lại hai chính sách đầu tiên)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey.shade50,
              borderRadius: const BorderRadius.vertical(
                bottom: Radius.circular(8),
              ),
            ),
            child: Column(
              children: [
                _buildPolicyItem(Icons.payment, 'Thanh toán trả trước'),
                const SizedBox(height: 12),
                _buildPolicyItem(
                  Icons.card_giftcard,
                  'Nhận thưởng lên đến 7.000 HF Xu',
                ),
                const SizedBox(height: 12),
                _buildPolicyItem(
                  Icons.verified_user,
                  'Nhận ưu đãi hấp dẫn khi hoàn thành nhận phòng',
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => RoomDetailScreen(
                              maPhong: room.maPhong,
                              checkIn: widget.checkIn,
                              checkOut: widget.checkOut,
                              checkInTime: widget.checkInTime,
                              checkOutTime: widget.checkOutTime,
                            ),
                          ),
                        );
                      },
                      child: Text(
                        'Chi tiết phòng >',
                        style: TextStyle(
                          color: Colors.orange.shade700,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDateInfoCard() {
    // Tính số ngày lưu trú - cộng thêm 1 để chính xác
    final difference = widget.checkOut.difference(widget.checkIn).inDays + 1;
    final daysText = difference == 1
        ? '01 ngày'
        : difference < 10
        ? '0$difference ngày'
        : '$difference ngày';

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 10, 16, 10),
      decoration: BoxDecoration(
        color: Colors.blue.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.blue.shade100, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Phần "Theo ngày | XX ngày"
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Image.asset(
                      'assets/icons/ic_booking_to_day_home.png',
                      width: 18,
                      height: 18,
                      errorBuilder: (context, error, stackTrace) => const Icon(
                        Icons.calendar_month,
                        size: 18,
                        color: Colors.orange,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Theo ngày | $daysText',
                      style: const TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 14,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const Divider(height: 1, thickness: 1, color: Color(0xFFE0E0E0)),
          // Phần thông tin check-in/check-out
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Nhận phòng',
                      style: TextStyle(color: Colors.black54, fontSize: 12),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${widget.checkInTime}, ${DateFormat('dd/MM').format(widget.checkIn)}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                const Icon(
                  Icons.arrow_forward,
                  color: Colors.black45,
                  size: 20,
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Trả phòng',
                      style: TextStyle(color: Colors.black54, fontSize: 12),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${widget.checkOutTime}, ${DateFormat('dd/MM').format(widget.checkOut)}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPolicyItem(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 18, color: Colors.grey.shade600),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: TextStyle(color: Colors.grey.shade700, fontSize: 14),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: _buildAppBar(),
      body: _isLoadingRooms
          ? const Center(child: CircularProgressIndicator())
          : _error != null
          ? ErrorDisplay(errorMessage: _error!)
          : _rooms.isEmpty
          ? const Center(child: Text('Không có phòng khả dụng.'))
          : ListView.builder(
              itemCount: _rooms.length + 1, // +1 for date info card
              itemBuilder: (context, index) {
                if (index == 0) {
                  return _buildDateInfoCard();
                }
                return _buildRoomItem(_rooms[index - 1]);
              },
            ),
    );
  }
}
