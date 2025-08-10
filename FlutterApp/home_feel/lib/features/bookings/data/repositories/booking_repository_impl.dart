import 'package:home_feel/shared/models/api_response.dart';
import '../../data/datasources/booking_remote_data_source.dart';
import '../../data/models/booking_detail_response_dto.dart';
import '../../data/models/booking_payment_response_dto.dart';
import '../../data/models/booking_list_response_dto.dart';
import '../../domain/repositories/booking_repository.dart';

class BookingRepositoryImpl implements BookingRepository {
  final BookingRemoteDataSource remoteDataSource;

  BookingRepositoryImpl(this.remoteDataSource);

  @override
  Future<ApiResponse<String>> createBooking({
    required String maPhong,
    required DateTime ngayDen,
    required DateTime ngayDi,
  }) async {
    return await remoteDataSource.createBooking(
      maPhong: maPhong,
      ngayDen: ngayDen,
      ngayDi: ngayDi,
    );
  }

  @override
  Future<ApiResponse<BookingPaymentResponseDto>> confirmBooking({
    required String maPDPhong,
    required List<String> serviceIds,
    required String promotionId,
  }) async {
    return await remoteDataSource.confirmBooking(
      maPDPhong: maPDPhong,
      serviceIds: serviceIds,
      promotionId: promotionId,
    );
  }

  @override
  Future<ApiResponse<BookingDetailResponseDto>> getBookingDetail({
    required String bookingId,
  }) async {
    return await remoteDataSource.getBookingDetail(bookingId: bookingId);
  }

  @override
  Future<ApiResponse> bookingPayment({
    required String maPDPhong,
    required double soTien,
    required String phuongThuc,
  }) async {
    return await remoteDataSource.bookingPayment(
      maPDPhong: maPDPhong,
      soTien: soTien,
      phuongThuc: phuongThuc,
    );
  }

  @override
  Future<ApiResponse<List<BookingListResponseDto>>> getMyBookings() async {
    return await remoteDataSource.getMyBookings();
  }

  @override
  Future<ApiResponse> cancelBooking({
    required String maPDPhong,
    required String lyDoHuy,
    required String tenNganHang,
    required String soTaiKhoan,
  }) async {
    return await remoteDataSource.cancelBooking(
      maPDPhong: maPDPhong,
      lyDoHuy: lyDoHuy,
      tenNganHang: tenNganHang,
      soTaiKhoan: soTaiKhoan,
    );
  }
}
