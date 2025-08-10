import '../repositories/booking_repository.dart';
import '../../data/models/booking_list_response_dto.dart';

class GetMyBookingsUseCase {
  final BookingRepository repository;

  GetMyBookingsUseCase(this.repository);

  Future<List<BookingListResponseDto>?> call() async {
    final response = await repository.getMyBookings();
    if (response.success && response.data != null) {
      return response.data;
    }
    return [];
  }
}
