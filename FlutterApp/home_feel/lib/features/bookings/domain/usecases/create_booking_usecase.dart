import '../repositories/booking_repository.dart';

class CreateBookingUseCase {
  final BookingRepository repository;

  CreateBookingUseCase(this.repository);

  Future<String?> call({
    required String maPhong,
    required DateTime ngayDen,
    required DateTime ngayDi,
  }) async {
    final response = await repository.createBooking(
      maPhong: maPhong,
      ngayDen: ngayDen,
      ngayDi: ngayDi,
    );
    if (response.success && response.data != null) {
      return response.data;
    }
    return null;
  }
}
