import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:home_feel/features/bookings/presentation/bloc/booking_bloc.dart';
import 'package:home_feel/features/bookings/presentation/bloc/booking_event.dart';
import 'package:home_feel/features/bookings/presentation/bloc/booking_state.dart';
import 'package:home_feel/features/home/presentation/screens/home_screen.dart';

class BookingPaymentScreen extends StatefulWidget {
  final String maPDPhong;
  final String maHD;
  final double totalAmount;
  final String status;
  final String phuongThuc;

  const BookingPaymentScreen({
    Key? key,
    required this.maPDPhong,
    required this.maHD,
    required this.totalAmount,
    required this.status,
    required this.phuongThuc,
  }) : super(key: key);

  @override
  State<BookingPaymentScreen> createState() => _BookingPaymentScreenState();
}

class _BookingPaymentScreenState extends State<BookingPaymentScreen> {
  bool _isProcessing = false;

  void _confirmPayment() {
    setState(() {
      _isProcessing = true;
    });

    // Log để kiểm tra giá trị các tham số
    print('DEBUG - totalAmount: ${widget.maPDPhong}');
    print('DEBUG - totalAmount type: ${widget.totalAmount.runtimeType}');
    print(
      'DEBUG - Payment details: maPDPhong=${widget.maPDPhong}, maHD=${widget.maHD}, '
      'status=${widget.status}, phuongThuc=${widget.phuongThuc}',
    );

    final bookingBloc = BlocProvider.of<BookingBloc>(context);
    bookingBloc.add(
      BookingPaymentEvent(
        maPDPhong: widget.maPDPhong,
        soTien: widget.totalAmount,
        phuongThuc: widget.phuongThuc,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Xác nhận thanh toán',
          style: TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.w600,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black87),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: BlocListener<BookingBloc, BookingState>(
        listener: (context, state) {
          if (state is BookingPaymentSuccess) {
            // Hiển thị thông báo thành công
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.green,
              ),
            );

            // Chuyển về màn hình chính
            Future.delayed(const Duration(seconds: 1), () {
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (context) => const HomeScreen()),
                (route) => false,
              );
            });
          } else if (state is BookingError) {
            // Hiển thị thông báo lỗi
            setState(() {
              _isProcessing = false;
            });
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red,
              ),
            );
          }
        },
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Thông tin thanh toán
              _buildPaymentInfoCard(),

              // Thông tin hóa đơn
              _buildInvoiceCard(),

              // Nút thanh toán
              _buildPaymentButton(),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPaymentInfoCard() {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            spreadRadius: 1,
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Thông tin thanh toán',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.grey.shade800,
            ),
          ),
          const SizedBox(height: 16),
          _buildInfoRow('Mã phiếu đặt phòng:', widget.maPDPhong),
          const SizedBox(height: 8),
          _buildInfoRow('Mã hóa đơn:', widget.maHD),
          const SizedBox(height: 8),
          _buildInfoRow('Trạng thái:', widget.status),
          const SizedBox(height: 8),
          _buildInfoRow('Phương thức thanh toán:', widget.phuongThuc),
          const SizedBox(height: 8),
          _buildInfoRow(
            'Tổng tiền:',
            NumberFormat.currency(
              locale: 'vi_VN',
              symbol: 'đ',
            ).format(widget.totalAmount).replaceAll('.', ','),
            isAmount: true,
          ),
        ],
      ),
    );
  }

  Widget _buildInvoiceCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            spreadRadius: 1,
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Lưu ý thanh toán',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.grey.shade800,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Xin vui lòng xác nhận thanh toán đơn đặt phòng của bạn. '
            'Sau khi xác nhận thanh toán, hệ thống sẽ gửi thông tin xác nhận '
            'qua email và tin nhắn điện thoại của bạn.',
            style: TextStyle(fontSize: 14, color: Colors.black87, height: 1.5),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Icon(Icons.info_outline, color: Colors.amber.shade800, size: 20),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  'Vui lòng kiểm tra thông tin trước khi xác nhận',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentButton() {
    return Container(
      margin: const EdgeInsets.all(16),
      child: ElevatedButton(
        onPressed: _isProcessing ? null : _confirmPayment,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.green.shade600,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          disabledBackgroundColor: Colors.grey.shade400,
        ),
        child: _isProcessing
            ? Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    'Đang xử lý...',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ],
              )
            : const Text(
                'Xác nhận thanh toán',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {bool isAmount = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(fontSize: 14, color: Colors.grey.shade700),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: isAmount ? 16 : 14,
            fontWeight: isAmount ? FontWeight.bold : FontWeight.w500,
            color: isAmount ? Colors.deepOrange : Colors.black87,
          ),
        ),
      ],
    );
  }
}
