import '../repositories/booking_repository.dart';
import '../../data/models/booking_payment_response_dto.dart';

class ConfirmBookingUseCase {
  final BookingRepository repository;

  ConfirmBookingUseCase(this.repository);

  Future<BookingPaymentResponseDto?> call({
    required String maPDPhong,
    required List<String> serviceIds,
    required String promotionId,
  }) async {
    final response = await repository.confirmBooking(
      maPDPhong: maPDPhong,
      serviceIds: serviceIds,
      promotionId: promotionId,
    );
    if (response.success && response.data != null) {
      return response.data;
    }
    return null;
  }
}
