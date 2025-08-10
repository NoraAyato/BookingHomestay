import '../repositories/booking_repository.dart';

class BookingPaymentUseCase {
  final BookingRepository repository;

  BookingPaymentUseCase(this.repository);

  Future<bool> call({
    required String maPDPhong,
    required double soTien,
    required String phuongThuc,
  }) async {
    final response = await repository.bookingPayment(
      maPDPhong: maPDPhong,
      soTien: soTien,
      phuongThuc: phuongThuc,
    );
    return response.success;
  }
}
