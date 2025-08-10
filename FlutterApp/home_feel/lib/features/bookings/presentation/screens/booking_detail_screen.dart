import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:home_feel/features/bookings/data/models/booking_detail_response_dto.dart';
import 'package:home_feel/features/bookings/presentation/bloc/booking_bloc.dart';
import 'package:home_feel/features/bookings/presentation/bloc/booking_event.dart';
import 'package:home_feel/features/bookings/presentation/bloc/booking_state.dart';
import 'package:home_feel/shared/widgets/loading_indicator.dart';
import 'package:home_feel/shared/presentation/widgets/app_dialog.dart';

class BookingDetailScreen extends StatefulWidget {
  final String maPDP;

  const BookingDetailScreen({Key? key, required this.maPDP}) : super(key: key);

  @override
  State<BookingDetailScreen> createState() => _BookingDetailScreenState();
}

class _BookingDetailScreenState extends State<BookingDetailScreen> {
  @override
  void initState() {
    super.initState();
    // Gọi sự kiện để lấy chi tiết đơn đặt phòng khi màn hình được khởi tạo
    context.read<BookingBloc>().add(
      GetBookingDetailEvent(bookingId: widget.maPDP),
    );
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        // Khi người dùng nhấn nút Back vật lý, tải lại danh sách đặt phòng trước khi quay lại
        context.read<BookingBloc>().add(GetMyBookingsEvent());
        return true; // Cho phép pop màn hình
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Chi tiết đặt phòng'),
          backgroundColor: Theme.of(context).primaryColor,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () {
              // Khi nhấn nút Back trên AppBar, tải lại danh sách đặt phòng trước khi quay lại
              context.read<BookingBloc>().add(GetMyBookingsEvent());
              Navigator.of(context).pop();
            },
          ),
        ),
        body: BlocConsumer<BookingBloc, BookingState>(
          listener: (context, state) {
            if (state is BookingCancelSuccess) {
              // Hiển thị thông báo thành công bằng AppDialog
              showAppDialog(
                context: context,
                title: 'Thành công',
                message: state.message,
                type: AppDialogType.success,
                buttonText: 'Đóng',
                onButtonPressed: () {
                  // Đóng dialog và quay lại màn hình danh sách
                  Navigator.of(context).pop(); // Đóng dialog
                  Navigator.of(context).pop(); // Quay lại màn hình danh sách
                },
              );
            } else if (state is BookingError) {
              // Hiển thị thông báo lỗi bằng AppDialog
              showAppDialog(
                context: context,
                title: 'Lỗi',
                message: state.message,
                type: AppDialogType.error,
                buttonText: 'Đóng',
              );
            }
          },
          builder: (context, state) {
            if (state is BookingLoading) {
              return const Center(child: LoadingIndicator());
            } else if (state is BookingDetailLoaded) {
              return _buildBookingDetailContent(state.detail);
            } else if (state is BookingError) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      size: 60,
                      color: Colors.red,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Lỗi: ${state.message}',
                      style: const TextStyle(fontSize: 16),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: () {
                        context.read<BookingBloc>().add(
                          GetBookingDetailEvent(bookingId: widget.maPDP),
                        );
                      },
                      child: const Text('Thử lại'),
                    ),
                  ],
                ),
              );
            }
            // Trạng thái mặc định hoặc không xác định
            return const Center(child: Text('Đang tải thông tin...'));
          },
        ),
      ),
    );
  }

  Widget _buildBookingDetailContent(BookingDetailResponseDto detail) {
    final currencyFormat = NumberFormat.currency(locale: 'vi_VN', symbol: 'đ');

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildInfoCard(
            title: 'Thông tin đặt phòng',
            content: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildInfoRow('Mã đặt phòng:', detail.maPDPhong),
                _buildInfoRow('Ngày nhận phòng:', detail.ngayNhanPhong),
                _buildInfoRow('Ngày trả phòng:', detail.ngayTraPhong),
                _buildInfoRow(
                  'Tổng tiền phòng:',
                  currencyFormat.format(detail.tongTienPhong),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          _buildInfoCard(
            title: 'Thông tin phòng và homestay',
            content: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildInfoRow('Tên homestay:', detail.tenHomestay),
                _buildInfoRow('Địa chỉ:', detail.diaChiHomestay),
                _buildInfoRow('Tên phòng:', detail.tenPhong),
                _buildInfoRow('Loại phòng:', detail.tenLoaiPhong),
              ],
            ),
          ),
          const SizedBox(height: 16),

          _buildInfoCard(
            title: 'Thông tin khách hàng',
            content: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildInfoRow('Tên khách hàng:', detail.userName),
                _buildInfoRow('Số điện thoại:', detail.soDienThoai),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Dịch vụ sử dụng
          if (detail.dichVuSuDung.isNotEmpty)
            _buildInfoCard(
              title: 'Dịch vụ sử dụng',
              content: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: detail.dichVuSuDung.map((dichVu) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [Text(dichVu)],
                    ),
                  );
                }).toList(),
              ),
            ),
          const SizedBox(height: 16),

          // Thông tin thanh toán
          _buildInfoCard(
            title: 'Thông tin thanh toán',
            content: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildInfoRow(
                  'Tổng tiền:',
                  currencyFormat.format(detail.tongTienPhong),
                  valueStyle: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.red,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Chính sách
          _buildInfoCard(
            title: 'Chính sách',
            content: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildInfoRow(
                  'Chính sách nhận phòng:',
                  detail.chinhSachNhanPhong,
                ),
                _buildInfoRow(
                  'Chính sách trả phòng:',
                  detail.chinhSachTraPhong,
                ),
                _buildInfoRow(
                  'Chính sách hủy phòng:',
                  detail.chinhSachHuyPhong,
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Các nút hành động (nếu cần)
          Center(
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                padding: const EdgeInsets.symmetric(
                  horizontal: 32,
                  vertical: 12,
                ),
              ),
              onPressed: () {
                // Xử lý hủy đặt phòng ở đây
                _showCancelBookingDialog();
              },
              child: const Text('Hủy đặt phòng'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard({required String title, required Widget content}) {
    return Card(
      elevation: 2,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.blue,
              ),
            ),
            const Divider(),
            const SizedBox(height: 8),
            content,
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {TextStyle? valueStyle}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.black54,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: valueStyle ?? const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  void _showCancelBookingDialog() {
    final TextEditingController _lyDoHuyController = TextEditingController();
    final TextEditingController _tenNganHangController =
        TextEditingController();
    final TextEditingController _soTaiKhoanController = TextEditingController();

    // Form key để validate
    final _formKey = GlobalKey<FormState>();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Hủy đặt phòng'),
        content: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'Vui lòng điền đầy đủ thông tin để hoàn tất việc hủy đặt phòng.',
                  style: TextStyle(fontSize: 14),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _lyDoHuyController,
                  decoration: const InputDecoration(
                    labelText: 'Lý do hủy *',
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                  ),
                  maxLines: 3,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Vui lòng nhập lý do hủy';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _tenNganHangController,
                  decoration: const InputDecoration(
                    labelText: 'Tên ngân hàng *',
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Vui lòng nhập tên ngân hàng';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _soTaiKhoanController,
                  decoration: const InputDecoration(
                    labelText: 'Số tài khoản *',
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                  ),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Vui lòng nhập số tài khoản';
                    }
                    return null;
                  },
                ),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () {
              // Validate form
              if (_formKey.currentState!.validate()) {
                // Đóng dialog
                Navigator.pop(context);

                // Hiển thị dialog xác nhận cuối cùng
                _showConfirmCancelBookingDialog(
                  lyDoHuy: _lyDoHuyController.text.trim(),
                  tenNganHang: _tenNganHangController.text.trim(),
                  soTaiKhoan: _soTaiKhoanController.text.trim(),
                );
              }
            },
            child: const Text('Tiếp tục'),
            style: TextButton.styleFrom(foregroundColor: Colors.blue),
          ),
        ],
      ),
    );
  }

  void _showConfirmCancelBookingDialog({
    required String lyDoHuy,
    required String tenNganHang,
    required String soTaiKhoan,
  }) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Xác nhận hủy đặt phòng'),
        content: const Text(
          'Bạn có chắc chắn muốn hủy đặt phòng này không? Hành động này không thể hoàn tác.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Không'),
          ),
          TextButton(
            onPressed: () {
              // Đóng dialog
              Navigator.pop(context);

              // Gọi event hủy đặt phòng
              context.read<BookingBloc>().add(
                CancelBookingEvent(
                  maPDPhong: widget.maPDP,
                  lyDoHuy: lyDoHuy,
                  tenNganHang: tenNganHang,
                  soTaiKhoan: soTaiKhoan,
                ),
              );

              // Hiển thị thông báo đang xử lý
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Đang xử lý yêu cầu hủy đặt phòng...'),
                  duration: Duration(seconds: 2),
                ),
              );
            },
            child: const Text('Có, hủy đặt phòng'),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
          ),
        ],
      ),
    );
  }
}
