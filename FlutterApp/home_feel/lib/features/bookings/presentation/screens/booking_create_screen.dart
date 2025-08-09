import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:home_feel/features/bookings/data/models/booking_detail_response_dto.dart';
import 'package:home_feel/features/bookings/presentation/bloc/booking_bloc.dart';
import 'package:home_feel/features/bookings/presentation/bloc/booking_event.dart';
import 'package:home_feel/features/bookings/presentation/bloc/booking_state.dart';
import 'package:home_feel/features/bookings/presentation/screens/payment_methods_screen.dart';
import 'package:home_feel/core/constants/api.dart';

class BookingCreateScreen extends StatefulWidget {
  final String maPDP;

  const BookingCreateScreen({Key? key, required this.maPDP}) : super(key: key);

  @override
  State<BookingCreateScreen> createState() => _BookingCreateScreenState();
}

class _BookingCreateScreenState extends State<BookingCreateScreen> {
  bool _isLoading = true;
  BookingDetailResponseDto? _bookingDetail;
  String? _error;
  String _selectedPaymentMethod =
      ''; // Biến để lưu phương thức thanh toán đã chọn

  @override
  void initState() {
    super.initState();
    _loadBookingDetail();
  }

  void _loadBookingDetail() {
    final bloc = context.read<BookingBloc>();
    bloc.add(GetBookingDetailEvent(bookingId: widget.maPDP));
  }

  void _showPaymentMethodsOverlay() {
    Navigator.of(context).push(
      PageRouteBuilder(
        opaque: false,
        pageBuilder: (context, animation, secondaryAnimation) {
          return SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(1, 0),
              end: Offset.zero,
            ).animate(animation),
            child: PaymentMethodsScreen(
              onSelectPaymentMethod: (method) {
                setState(() {
                  _selectedPaymentMethod = method;
                });
                Navigator.pop(context);
              },
            ),
          );
        },
        transitionDuration: const Duration(milliseconds: 300),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: const BackButton(color: Colors.black54),
        title: const Text(
          'Xác nhận và thanh toán',
          style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: BlocListener<BookingBloc, BookingState>(
        listener: (context, state) {
          if (state is BookingLoading) {
            setState(() {
              _isLoading = true;
            });
          } else if (state is BookingDetailLoaded) {
            setState(() {
              _bookingDetail = state.detail;
              _isLoading = false;
            });
          } else if (state is BookingError) {
            setState(() {
              _error = state.message;
              _isLoading = false;
            });
          }
        },
        child: _buildBody(),
      ),
      bottomNavigationBar: _buildBottomBar(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(Colors.deepOrange),
        ),
      );
    }

    if (_error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: Colors.red),
              const SizedBox(height: 16),
              Text(
                'Đã xảy ra lỗi',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.red.shade700,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _error!,
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey.shade700),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _loadBookingDetail,
                style: ElevatedButton.styleFrom(
                  foregroundColor: Colors.white,
                  backgroundColor: Colors.deepOrange,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32,
                    vertical: 12,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                ),
                child: const Text('Thử lại'),
              ),
            ],
          ),
        ),
      );
    }

    if (_bookingDetail == null) {
      return const Center(child: Text('Không có thông tin phiếu đặt phòng'));
    }

    // Cập nhật UI với thiết kế mới
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildInfoCard(),
          _buildGuestInfoSection(),
          _buildPriceDetails(),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildInfoCard() {
    if (_bookingDetail == null) return const SizedBox();

    // Chuyển đổi từ string sang DateTime
    final ngayDen = DateFormat(
      'yyyy-MM-dd',
    ).parse(_bookingDetail!.ngayNhanPhong);
    final ngayDi = DateFormat('yyyy-MM-dd').parse(_bookingDetail!.ngayTraPhong);

    // Tính số ngày lưu trú
    final difference = ngayDi.difference(ngayDen).inDays;

    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 3,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header - Lựa chọn của bạn
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(
              'Lựa chọn của bạn',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
                color: Colors.grey.shade800,
              ),
            ),
          ),

          // Room info with image
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Room image
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                    image: _bookingDetail!.hinhAnhPhong.isNotEmpty
                        ? DecorationImage(
                            image: NetworkImage(
                              ApiConstants.baseUrl +
                                  _bookingDetail!.hinhAnhPhong,
                            ),
                            fit: BoxFit.cover,
                          )
                        : null,
                    color: Colors.grey.shade200,
                  ),
                  child: _bookingDetail!.hinhAnhPhong.isEmpty
                      ? const Center(
                          child: Icon(
                            Icons.image_not_supported,
                            color: Colors.grey,
                          ),
                        )
                      : null,
                ),
                const SizedBox(width: 16),
                // Room details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _bookingDetail!.tenPhong,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _bookingDetail!.tenLoaiPhong,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey.shade700,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _bookingDetail!.diaChiHomestay,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey.shade600,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 8),
          const Divider(height: 1, thickness: 1, color: Color(0xFFF0F0F0)),

          // Thông tin check-in/check-out theo thiết kế mới
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // Calendar icon with day count
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: Colors.blue.shade100,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.calendar_today,
                        color: Colors.blue.shade600,
                        size: 28,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '$difference ngày',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: Colors.blue.shade800,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                // Check-in/check-out details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Nhận phòng
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Nhận phòng',
                            style: TextStyle(
                              color: Colors.black54,
                              fontSize: 12,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Text(
                                '${_bookingDetail!.chinhSachNhanPhong} • ',
                                style: TextStyle(
                                  fontWeight: FontWeight.w500,
                                  fontSize: 14,
                                  color: Colors.grey.shade800,
                                ),
                              ),
                              Text(
                                DateFormat('dd/MM/yyyy').format(ngayDen),
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                  color: Colors.grey.shade900,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      // Trả phòng
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Trả phòng',
                            style: TextStyle(
                              color: Colors.black54,
                              fontSize: 12,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Text(
                                '${_bookingDetail!.chinhSachTraPhong} • ',
                                style: TextStyle(
                                  fontWeight: FontWeight.w500,
                                  fontSize: 14,
                                  color: Colors.grey.shade800,
                                ),
                              ),
                              Text(
                                DateFormat('dd/MM/yyyy').format(ngayDi),
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                  color: Colors.grey.shade900,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPriceDetails() {
    if (_bookingDetail == null) return const SizedBox();

    // Giá cuối cùng
    final finalPrice = _bookingDetail!.tongTienPhong;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Chi tiết thanh toán
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                spreadRadius: 1,
                blurRadius: 3,
                offset: const Offset(0, 1),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'Chi tiết thanh toán',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey.shade800,
                  ),
                ),
              ),
              const Divider(height: 1, thickness: 1, color: Color(0xFFF0F0F0)),
              // Chi tiết giá
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _buildPriceRow('Tiền phòng', finalPrice),
                    const SizedBox(height: 16),
                    _buildPriceRow(
                      'Tổng thanh toán',
                      finalPrice,
                      isTotal: true,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        // Phần chính sách hủy phòng
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                spreadRadius: 1,
                blurRadius: 3,
                offset: const Offset(0, 1),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'Chính sách hủy phòng',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey.shade800,
                  ),
                ),
              ),
              const Divider(height: 1, thickness: 1, color: Color(0xFFF0F0F0)),
              // Chính sách hủy phòng
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _bookingDetail!.chinhSachHuyPhong,
                      style: TextStyle(
                        color: Colors.grey.shade700,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(
                          Icons.lightbulb_outline,
                          size: 18,
                          color: Colors.amber.shade700,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Gợi ý nhỏ: Hãy chọn phương thức thanh toán ở phía dưới để hoàn tất đặt phòng.',
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.grey.shade700,
                              fontStyle: FontStyle.italic,
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
        ),

        // Add services section if available
        if (_bookingDetail!.dichVuSuDung.isNotEmpty)
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.1),
                  spreadRadius: 1,
                  blurRadius: 3,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Dịch vụ đã chọn',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 12),
                ...List.generate(
                  _bookingDetail!.dichVuSuDung.length,
                  (index) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        Icon(
                          Icons.check_circle,
                          size: 16,
                          color: Colors.green.shade600,
                        ),
                        const SizedBox(width: 8),
                        Text(_bookingDetail!.dichVuSuDung[index]),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildPriceRow(String label, double amount, {bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            fontSize: isTotal ? 16 : 14,
          ),
        ),
        Text(
          NumberFormat.currency(
            locale: 'vi_VN',
            symbol: 'đ',
          ).format(amount).replaceAll('.', ','),
          style: TextStyle(
            fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            fontSize: isTotal ? 16 : 14,
          ),
        ),
      ],
    );
  }

  Widget _buildGuestInfoSection() {
    if (_bookingDetail == null) return const SizedBox();

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 3,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header - Người đặt phòng
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Người đặt phòng',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey.shade800,
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    // Xử lý sự kiện chỉnh sửa thông tin người dùng
                  },
                  child: Text(
                    'Sửa',
                    style: TextStyle(
                      color: Colors.orange.shade700,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, thickness: 1, color: Color(0xFFF0F0F0)),

          // Guest info with modern style
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Phone number row
                Row(
                  children: [
                    Text(
                      'Số điện thoại',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey.shade600,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      _bookingDetail!.soDienThoai.isNotEmpty
                          ? _bookingDetail!.soDienThoai
                          : '+84 395437619',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                // Username row
                Row(
                  children: [
                    Text(
                      'Họ tên',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey.shade600,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      _bookingDetail!.userName.isNotEmpty
                          ? _bookingDetail!.userName
                          : 'User68',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
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

  Widget _buildBottomBar() {
    if (_isLoading || _error != null || _bookingDetail == null) {
      return const SizedBox();
    }

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            spreadRadius: 1,
            blurRadius: 5,
            offset: const Offset(0, -1),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Phần chọn phương thức thanh toán
          InkWell(
            onTap: _showPaymentMethodsOverlay,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
              child: Row(
                children: [
                  Icon(
                    Icons.credit_card,
                    color: _selectedPaymentMethod.isEmpty
                        ? Colors.orange.shade700
                        : Colors.green.shade600,
                    size: 20,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      _selectedPaymentMethod.isEmpty
                          ? 'Chọn phương thức thanh toán'
                          : _selectedPaymentMethod,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: _selectedPaymentMethod.isEmpty
                            ? FontWeight.w500
                            : FontWeight.w600,
                        color: _selectedPaymentMethod.isEmpty
                            ? Colors.grey.shade700
                            : Colors.green.shade700,
                      ),
                    ),
                  ),
                  Icon(
                    _selectedPaymentMethod.isEmpty
                        ? Icons.arrow_forward_ios
                        : Icons.check_circle,
                    size: 14,
                    color: _selectedPaymentMethod.isEmpty
                        ? Colors.grey.shade600
                        : Colors.green.shade600,
                  ),
                ],
              ),
            ),
          ),

          const Divider(height: 1),

          // Phần tổng tiền và nút đặt phòng
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Tổng thanh toán',
                        style: TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                      Text(
                        NumberFormat.currency(locale: 'vi_VN', symbol: 'đ')
                            .format(_bookingDetail!.tongTienPhong)
                            .replaceAll('.', ','),
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.deepOrange,
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(
                  width: MediaQuery.of(context).size.width * 0.4,
                  child: ElevatedButton(
                    onPressed: !_selectedPaymentMethod.isEmpty
                        ? () {
                            // TODO: Implement booking confirmation
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Đặt phòng thành công!'),
                                backgroundColor: Colors.green,
                              ),
                            );
                          }
                        : () {
                            // Hiển thị lỗi khi chưa chọn phương thức thanh toán
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                  'Vui lòng chọn phương thức thanh toán',
                                ),
                                backgroundColor: Colors.orange,
                              ),
                            );
                            _showPaymentMethodsOverlay();
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: !_selectedPaymentMethod.isEmpty
                          ? Colors.green.shade600
                          : Colors.deepOrange,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Đặt phòng',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        if (_selectedPaymentMethod.isNotEmpty) ...[
                          const SizedBox(width: 8),
                          Icon(Icons.check_circle_outline, size: 16),
                        ],
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
