import '../repositories/booking_repository.dart';
import '../../data/models/booking_detail_response_dto.dart';

class GetBookingDetailUseCase {
  final BookingRepository repository;

  GetBookingDetailUseCase(this.repository);

  Future<BookingDetailResponseDto?> call({required String bookingId}) async {
    final response = await repository.getBookingDetail(bookingId: bookingId);
    if (response.success && response.data != null) {
      return response.data;
    }
    return null;
  }
}
