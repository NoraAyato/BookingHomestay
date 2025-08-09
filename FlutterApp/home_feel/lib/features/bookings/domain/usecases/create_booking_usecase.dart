import '../../data/datasources/booking_remote_data_source.dart';

class CreateBookingUseCase {
  final BookingRemoteDataSource remoteDataSource;

  CreateBookingUseCase(this.remoteDataSource);

  Future<String?> call({
    required String maPhong,
    required DateTime ngayDen,
    required DateTime ngayDi,
  }) async {
    final response = await remoteDataSource.createBooking(
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
