import '../../data/datasources/booking_remote_data_source.dart';

class BookingPaymentUseCase {
  final BookingRemoteDataSource remoteDataSource;

  BookingPaymentUseCase(this.remoteDataSource);

  Future<bool> call({
    required String maPDPhong,
    required String maHD,
    required double totalAmount,
    required String status,
  }) async {
    final response = await remoteDataSource.bookingPayment(
      maPDPhong: maPDPhong,
      maHD: maHD,
      totalAmount: totalAmount,
      status: status,
    );
    return response.success;
  }
}
