import '../../data/datasources/booking_remote_data_source.dart';
import '../../data/models/booking_payment_response_dto.dart';

class ConfirmBookingUseCase {
  final BookingRemoteDataSource remoteDataSource;

  ConfirmBookingUseCase(this.remoteDataSource);

  Future<BookingPaymentResponseDto?> call({
    required String maPDPhong,
    required List<String> serviceIds,
    required String promotionId,
  }) async {
    final response = await remoteDataSource.confirmBooking(
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
