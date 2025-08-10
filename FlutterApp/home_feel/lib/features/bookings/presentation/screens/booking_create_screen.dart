import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:home_feel/features/bookings/data/models/booking_detail_response_dto.dart';
import 'package:home_feel/features/bookings/presentation/bloc/booking_bloc.dart';
import 'package:home_feel/features/bookings/presentation/bloc/booking_event.dart';
import 'package:home_feel/features/bookings/presentation/bloc/booking_state.dart';
import 'package:home_feel/features/bookings/presentation/screens/payment_methods_screen.dart';
import 'package:home_feel/features/bookings/presentation/screens/booking_payment_screen.dart';
import 'package:home_feel/core/constants/api.dart';
import 'package:home_feel/features/home/presentation/bloc/home_bloc.dart';
import 'package:home_feel/features/home/presentation/bloc/home_event.dart';
import 'package:home_feel/features/home/presentation/bloc/home_state.dart';
import 'package:home_feel/features/home/data/models/homestay_dichvu_response_model.dart';
import 'package:home_feel/core/services/service_locator.dart';
import 'package:home_feel/features/promotion/data/models/promotion_model.dart';
import 'package:home_feel/features/promotion/presentation/bloc/promotion_bloc.dart';
import 'package:home_feel/features/promotion/presentation/screens/available_promotions_screen.dart';

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
  String _selectedPaymentMethod = '';
  HomestayDichVuResponseModel? _dichVuModel;
  bool _isLoadingDichVu = false;
  String? _dichVuError;
  List<String> _selectedDichVuIds = [];
  double _tongTienDichVu = 0;
  int _soNgayLuuTru = 0;

  // Thông tin khuyến mãi đã chọn
  String? _selectedPromotionId;
  String _promotionName = '';
  double _promotionDiscount = 0;
  String _promotionType = '';

  @override
  void initState() {
    super.initState();
    _loadBookingDetail();
  }

  void _loadBookingDetail() {
    final bloc = context.read<BookingBloc>();
    bloc.add(GetBookingDetailEvent(bookingId: widget.maPDP));
  }

  Future<void> _loadHomestayServices(String homestayId) async {
    setState(() {
      _isLoadingDichVu = true;
      _dichVuError = null;
    });

    try {
      // Gọi HomeBloc để load dịch vụ homestay
      final homeBloc = BlocProvider.of<HomeBloc>(context, listen: false);
      homeBloc.add(GetHomestayDichVuEvent(homestayId));

      // Đăng ký listener cho HomeBloc
      homeBloc.stream.listen((state) {
        if (state is HomeDichVuLoaded) {
          setState(() {
            _dichVuModel = state.dichvu;
            _isLoadingDichVu = false;
            _calculateDichVuPrice();
          });
        } else if (state is HomeDichVuError) {
          setState(() {
            _dichVuError = state.message;
            _isLoadingDichVu = false;
          });
        }
      });
    } catch (e) {
      setState(() {
        _dichVuError = e.toString();
        _isLoadingDichVu = false;
      });
    }
  }

  // Phương thức để tính toán giá dịch vụ
  void _calculateDichVuPrice() {
    if (_dichVuModel == null || _selectedDichVuIds.isEmpty) {
      _tongTienDichVu = 0;
      return;
    }

    double totalPrice = 0;
    for (final dichVu in _dichVuModel!.dichVus) {
      if (_selectedDichVuIds.contains(dichVu.maDV)) {
        totalPrice += dichVu.donGia;
      }
    }

    setState(() {
      _tongTienDichVu = totalPrice * _soNgayLuuTru;
    });
  }

  // Phương thức để chọn/bỏ chọn dịch vụ
  void _toggleDichVuSelection(String maDichVu) {
    setState(() {
      if (_selectedDichVuIds.contains(maDichVu)) {
        _selectedDichVuIds.remove(maDichVu);
      } else {
        _selectedDichVuIds.add(maDichVu);
      }
      _calculateDichVuPrice();
    });
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

  void _onConfirmBooking() {
    if (_bookingDetail == null) return;

    setState(() {
      _isLoading = true;
    });

    // Hiển thị dialog xác nhận
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text('Xác nhận đặt phòng'),
        content: const Text('Bạn có chắc chắn muốn đặt phòng này không?'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                _isLoading = false;
              });
            },
            child: Text('Hủy', style: TextStyle(color: Colors.grey.shade700)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _processBookingConfirmation();
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.deepOrange),
            child: const Text('Xác nhận'),
          ),
        ],
      ),
    );
  }

  void _processBookingConfirmation() {
    if (_bookingDetail == null) return;

    final bloc = context.read<BookingBloc>();

    // Gọi event xác nhận đặt phòng
    bloc.add(
      ConfirmBookingEvent(
        maPDPhong: _bookingDetail!.maPDPhong,
        serviceIds: _selectedDichVuIds,
        promotionId:
            _selectedPromotionId ??
            "", // Truyền chuỗi rỗng nếu không có khuyến mãi
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

              if (_bookingDetail != null) {
                final DateTime ngayDen = DateFormat(
                  'yyyy-MM-dd',
                ).parse(_bookingDetail!.ngayNhanPhong);
                final DateTime ngayDi = DateFormat(
                  'yyyy-MM-dd',
                ).parse(_bookingDetail!.ngayTraPhong);
                _soNgayLuuTru = ngayDi.difference(ngayDen).inDays;
                if (_soNgayLuuTru < 1) _soNgayLuuTru = 1;

                // Load dịch vụ homestay
                final String homestayId = _bookingDetail!.maHomestay;
                if (homestayId.isNotEmpty) {
                  _loadHomestayServices(homestayId);
                }
              }
            });
          } else if (state is BookingError) {
            setState(() {
              _error = state.message;
              _isLoading = false;
            });
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red,
              ),
            );
          } else if (state is ConfirmBookingSuccess) {
            // Chuyển hướng đến màn hình thanh toán khi xác nhận thành công
            setState(() {
              _isLoading = false;
            });
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => BookingPaymentScreen(
                  maPDPhong: state.maPDPhong,
                  maHD: state.maHD,
                  totalAmount: state.totalAmount,
                  status: state.status,
                  phuongThuc: _selectedPaymentMethod.isNotEmpty
                      ? _selectedPaymentMethod
                      : 'Chưa chọn phương thức thanh toán',
                ),
              ),
            );
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
          _buildPromotionSection(),
          _buildServicesSection(),
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

    // Giá phòng gốc
    final roomPrice = _bookingDetail!.tongTienPhong;

    // Tính chiết khấu khuyến mãi
    double discountAmount = 0;
    if (_selectedPromotionId != null) {
      if (_promotionType == 'percentage') {
        // Nếu là phần trăm, tính số tiền giảm dựa vào phần trăm
        discountAmount = (roomPrice * _promotionDiscount / 100);
      } else {
        // Nếu là số tiền cố định, nhân với 1000
        discountAmount = _promotionDiscount * 1000;
      }
    }

    // Giá phòng sau khi giảm
    final finalPrice = roomPrice - discountAmount;
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
                    _buildPriceRow('Tiền phòng', roomPrice),
                    if (_selectedPromotionId != null) ...[
                      const SizedBox(height: 8),
                      _buildPriceRow(
                        'Khuyến mãi (áp dụng cho tiền phòng)',
                        -discountAmount,
                        isDiscount: true,
                      ),
                    ],
                    if (_tongTienDichVu > 0) ...[
                      const SizedBox(height: 8),
                      _buildPriceRow('Tiền dịch vụ', _tongTienDichVu),
                    ],
                    const SizedBox(height: 16),
                    _buildPriceRow(
                      'Tổng thanh toán',
                      finalPrice + _tongTienDichVu,
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
      ],
    );
  }

  Widget _buildPriceRow(
    String label,
    double amount, {
    bool isTotal = false,
    bool isDiscount = false,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            fontSize: isTotal ? 16 : 14,
            color: isDiscount ? Colors.orange.shade700 : null,
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
            color: isDiscount ? Colors.orange.shade700 : null,
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

  Widget _buildPromotionSection() {
    return GestureDetector(
      onTap: () async {
        if (_bookingDetail == null) return;

        // Mở màn hình chọn ưu đãi
        final result = await Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => BlocProvider(
              create: (context) => sl<PromotionBloc>(),
              child: AvailablePromotionsScreen(
                maPDPhong: _bookingDetail!.maPDPhong,
                ngayDen: DateFormat(
                  'yyyy-MM-dd',
                ).parse(_bookingDetail!.ngayNhanPhong),
                ngayDi: DateFormat(
                  'yyyy-MM-dd',
                ).parse(_bookingDetail!.ngayTraPhong),
              ),
            ),
          ),
        );

        // Xử lý kết quả khi người dùng chọn ưu đãi
        if (result != null && result is PromotionModel) {
          setState(() {
            _selectedPromotionId = result.maKM;
            _promotionName = result.noiDung;
            _promotionDiscount = result.chietKhau;
            _promotionType = result.loaiChietKhau;
          });
        }
      },
      child: Container(
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
            // Header - Ưu đãi
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.discount_outlined,
                        color: Colors.orange,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Ưu đãi',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey.shade800,
                        ),
                      ),
                      if (_selectedPromotionId != null) ...[
                        const SizedBox(width: 16),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.orange.shade50,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.orange.shade200),
                          ),
                          child: Text(
                            _promotionType == 'percentage'
                                ? 'Giảm ${_promotionDiscount.toInt()}%'
                                : 'Giảm ${NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(_promotionDiscount * 1000).replaceAll('.', ',')}',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                              color: Colors.orange.shade700,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  Icon(Icons.arrow_forward_ios, size: 16, color: Colors.orange),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildServicesSection() {
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
          // Header - Dịch vụ bổ sung
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              'Dịch vụ bổ sung',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.grey.shade800,
              ),
            ),
          ),
          const Divider(height: 1, thickness: 1, color: Color(0xFFF0F0F0)),

          if (_isLoadingDichVu)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Center(
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.deepOrange),
                ),
              ),
            )
          else if (_dichVuError != null)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Center(
                child: Text(
                  'Không thể tải dịch vụ: $_dichVuError',
                  style: TextStyle(color: Colors.red.shade700),
                ),
              ),
            )
          else if (_dichVuModel == null || _dichVuModel!.dichVus.isEmpty)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Center(
                child: Text(
                  'Không có dịch vụ bổ sung',
                  style: TextStyle(color: Colors.grey.shade600),
                ),
              ),
            )
          else
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Chọn dịch vụ bạn muốn thêm (vuốt để xem thêm):',
                    style: TextStyle(fontSize: 14, fontStyle: FontStyle.italic),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    height: 106,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _dichVuModel!.dichVus.length,
                      itemBuilder: (context, index) {
                        final dichVu = _dichVuModel!.dichVus[index];
                        final isSelected = _selectedDichVuIds.contains(
                          dichVu.maDV,
                        );

                        return GestureDetector(
                          onTap: () => _toggleDichVuSelection(dichVu.maDV),
                          child: Container(
                            width:
                                320, // Tăng chiều rộng (chiều dài) từ 240px lên 320px
                            margin: const EdgeInsets.only(right: 12),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(
                                color: isSelected
                                    ? Colors.green.shade500
                                    : Colors.grey.shade300,
                                width: isSelected ? 2 : 1,
                              ),
                              color: isSelected
                                  ? Colors.green.shade50
                                  : Colors.white,
                            ),
                            child: Row(
                              children: [
                                // Hình ảnh dịch vụ
                                ClipRRect(
                                  borderRadius: BorderRadius.only(
                                    topLeft: Radius.circular(8),
                                    bottomLeft: Radius.circular(8),
                                  ),
                                  child: Container(
                                    width:
                                        110, // Tăng từ 80px lên 110px để cân đối với chiều dài thẻ mới
                                    height: double.infinity,
                                    color: Colors.grey.shade200,
                                    child: dichVu.hinhAnh.isNotEmpty
                                        ? Image.network(
                                            ApiConstants.baseUrl +
                                                dichVu.hinhAnh,
                                            fit: BoxFit.cover,
                                            errorBuilder:
                                                (context, error, stackTrace) {
                                                  return Icon(
                                                    Icons.image_not_supported,
                                                    color: Colors.grey.shade400,
                                                    size: 36,
                                                  );
                                                },
                                          )
                                        : Icon(
                                            Icons.room_service_outlined,
                                            color: Colors.grey.shade400,
                                            size: 36,
                                          ),
                                  ),
                                ),

                                // Thông tin dịch vụ
                                Expanded(
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 8,
                                    ),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      mainAxisAlignment: MainAxisAlignment
                                          .start, // Thay đổi từ spaceBetween sang start
                                      children: [
                                        Row(
                                          crossAxisAlignment: CrossAxisAlignment
                                              .start, // Thêm crossAxisAlignment
                                          children: [
                                            Expanded(
                                              child: Text(
                                                dichVu.tenDV,
                                                style: TextStyle(
                                                  fontWeight: FontWeight.w500,
                                                  fontSize: 16,
                                                  color: isSelected
                                                      ? Colors.green.shade700
                                                      : Colors.black87,
                                                ),
                                                maxLines: 2,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ),
                                            if (isSelected)
                                              Padding(
                                                padding: const EdgeInsets.only(
                                                  left: 4,
                                                ),
                                                child: Icon(
                                                  Icons.check_circle,
                                                  color: Colors.green.shade600,
                                                  size: 20,
                                                ),
                                              ),
                                          ],
                                        ),
                                        SizedBox(
                                          height: 8,
                                        ), // Thêm khoảng cách cố định phù hợp
                                        Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              '${NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(dichVu.donGia).replaceAll('.', ',')} / ngày',
                                              style: TextStyle(
                                                fontSize: 14,
                                                color: isSelected
                                                    ? Colors.green.shade700
                                                    : Colors.grey.shade700,
                                              ),
                                            ),
                                            if (_soNgayLuuTru > 1)
                                              Text(
                                                'Tổng: ${NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(dichVu.donGia * _soNgayLuuTru).replaceAll('.', ',')}',
                                                style: TextStyle(
                                                  fontSize: 13,
                                                  fontWeight: FontWeight.w500,
                                                  color: isSelected
                                                      ? Colors.green.shade700
                                                      : Colors.grey.shade700,
                                                ),
                                              ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  if (_selectedDichVuIds.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.green.shade50,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.green.shade200),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Tổng tiền dịch vụ (${_selectedDichVuIds.length} dịch vụ):',
                            style: TextStyle(
                              fontWeight: FontWeight.w500,
                              color: Colors.green.shade700,
                            ),
                          ),
                          Text(
                            NumberFormat.currency(
                              locale: 'vi_VN',
                              symbol: 'đ',
                            ).format(_tongTienDichVu).replaceAll('.', ','),
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.green.shade700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
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
                            .format(
                              // Tính tổng tiền bao gồm tiền phòng sau khi trừ khuyến mãi và tiền dịch vụ
                              (_bookingDetail!.tongTienPhong -
                                      (_selectedPromotionId != null
                                          ? (_promotionType == 'percentage'
                                                ? (_bookingDetail!
                                                          .tongTienPhong *
                                                      _promotionDiscount /
                                                      100)
                                                : _promotionDiscount * 1000)
                                          : 0)) +
                                  _tongTienDichVu,
                            )
                            .replaceAll('.', ','),
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color.fromARGB(255, 255, 119, 34),
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
                            // Gọi hàm xác nhận đặt phòng
                            _onConfirmBooking();
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
