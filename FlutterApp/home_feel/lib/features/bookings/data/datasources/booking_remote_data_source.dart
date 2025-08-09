import 'package:home_feel/core/services/api_service.dart';
import 'package:home_feel/shared/models/api_response.dart';
import '../models/booking_payment_response_dto.dart';
import '../models/booking_detail_response_dto.dart';
import 'package:home_feel/core/constants/api.dart';
abstract class BookingRemoteDataSource {
  Future<ApiResponse<String>> createBooking({
    required String maPhong,
    required DateTime ngayDen,
    required DateTime ngayDi,
  });
  Future<ApiResponse<BookingPaymentResponseDto>> confirmBooking({
    required String maPDPhong,
    required List<String> serviceIds,
    required String promotionId,
  });
  Future<ApiResponse<BookingDetailResponseDto>> getBookingDetail({
    required String bookingId,
  });
  Future<ApiResponse> bookingPayment({
    required String maPDPhong,
    required String maHD,
    required double totalAmount,
    required String status,
  });
}

class BookingRemoteDataSourceImpl implements BookingRemoteDataSource {
  final ApiService apiService;

  BookingRemoteDataSourceImpl(this.apiService);

  @override
  Future<ApiResponse<String>> createBooking({
    required String maPhong,
    required DateTime ngayDen,
    required DateTime ngayDi,
  }) async {
    try {
      final response = await apiService.post(
        '${ApiConstants.baseUrl}/api/Booking',
        data: {
          'maPhong': maPhong,
          'ngayDen': ngayDen.toIso8601String(),
          'ngayDi': ngayDi.toIso8601String(),
        },
      );
      return ApiResponse<String>.fromJson(
        response.data,
        (data) => data as String,
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Có lỗi xảy ra khi tạo booking',
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<BookingPaymentResponseDto>> confirmBooking({
    required String maPDPhong,
    required List<String> serviceIds,
    required String promotionId,
  }) async {
    try {
      final response = await apiService.post(
        '${ApiConstants.baseUrl}/api/Booking/confirm',
        data: {
          'maPDPhong': maPDPhong,
          'serviceIds': serviceIds,
          'promotionId': promotionId,
        },
      );
      return ApiResponse<BookingPaymentResponseDto>.fromJson(
        response.data,
        (data) => BookingPaymentResponseDto.fromJson(data),
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Có lỗi xảy ra khi xác nhận booking',
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<BookingDetailResponseDto>> getBookingDetail({
    required String bookingId,
  }) async {
    try {
      final response = await apiService.get('${ApiConstants.baseUrl}/api/Booking/$bookingId/detail');
      return ApiResponse<BookingDetailResponseDto>.fromJson(
        response.data,
        (data) => BookingDetailResponseDto.fromJson(data),
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Có lỗi xảy ra khi lấy chi tiết booking',
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse> bookingPayment({
    required String maPDPhong,
    required String maHD,
    required double totalAmount,
    required String status,
  }) async {
    try {
      final response = await apiService.post(
        '${ApiConstants.baseUrl}/api/Booking/payment',
        data: {
          'maPDPhong': maPDPhong,
          'maHD': maHD,
          'totalAmount': totalAmount,
          'status': status,
        },
      );
      return ApiResponse.fromJson(response.data, (data) => data);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Có lỗi xảy ra khi thanh toán booking',
        data: null,
      );
    }
  }
}
