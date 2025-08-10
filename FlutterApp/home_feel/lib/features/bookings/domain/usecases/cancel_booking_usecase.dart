import '../../domain/repositories/booking_repository.dart';
import 'package:home_feel/shared/models/api_response.dart';

class CancelBookingUseCase {
  final BookingRepository repository;

  CancelBookingUseCase(this.repository);

  Future<ApiResponse> call({
    required String maPDPhong,
    required String lyDoHuy,
    required String tenNganHang,
    required String soTaiKhoan,
  }) async {
    final response = await repository.cancelBooking(
      maPDPhong: maPDPhong,
      lyDoHuy: lyDoHuy,
      tenNganHang: tenNganHang,
      soTaiKhoan: soTaiKhoan,
    );
    return response;
  }
}
