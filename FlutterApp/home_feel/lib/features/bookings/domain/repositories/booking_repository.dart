import 'package:home_feel/shared/models/api_response.dart';
import '../../data/models/booking_detail_response_dto.dart';
import '../../data/models/booking_payment_response_dto.dart';
import '../../data/models/booking_list_response_dto.dart';

abstract class BookingRepository {
  /// Tạo booking mới với mã phòng, ngày đến, ngày đi
  Future<ApiResponse<String>> createBooking({
    required String maPhong,
    required DateTime ngayDen,
    required DateTime ngayDi,
  });

  /// Xác nhận booking với các dịch vụ và khuyến mãi
  Future<ApiResponse<BookingPaymentResponseDto>> confirmBooking({
    required String maPDPhong,
    required List<String> serviceIds,
    required String promotionId,
  });

  /// Lấy chi tiết booking
  Future<ApiResponse<BookingDetailResponseDto>> getBookingDetail({
    required String bookingId,
  });

  /// Thanh toán booking
  Future<ApiResponse> bookingPayment({
    required String maPDPhong,
    required double soTien,
    required String phuongThuc,
  });

  /// Lấy danh sách booking của người dùng
  Future<ApiResponse<List<BookingListResponseDto>>> getMyBookings();

  /// Hủy đặt phòng
  Future<ApiResponse> cancelBooking({
    required String maPDPhong,
    required String lyDoHuy,
    required String tenNganHang,
    required String soTaiKhoan,
  });
}
