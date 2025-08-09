import '../../data/datasources/booking_remote_data_source.dart';
import '../../data/models/booking_detail_response_dto.dart';

class GetBookingDetailUseCase {
  final BookingRemoteDataSource remoteDataSource;

  GetBookingDetailUseCase(this.remoteDataSource);

  Future<BookingDetailResponseDto?> call({required String bookingId}) async {
    final response = await remoteDataSource.getBookingDetail(
      bookingId: bookingId,
    );
    if (response.success && response.data != null) {
      return response.data;
    }
    return null;
  }
}
