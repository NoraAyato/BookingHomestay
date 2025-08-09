import 'package:dio/dio.dart';
import 'package:home_feel/core/network/dio_exception_mapper.dart';
import 'package:home_feel/features/home/data/models/available_room_model.dart';
import 'package:home_feel/features/home/data/models/homestay_tiennghi_response_model.dart';
import 'package:home_feel/features/home/data/models/homestay_image_response_model.dart';
import 'package:home_feel/core/constants/api.dart';
import 'package:home_feel/shared/models/api_response.dart';
import 'package:home_feel/core/services/api_service.dart';
import 'package:home_feel/features/home/data/models/homestay_model.dart';
import 'package:home_feel/features/home/data/models/homestay_search_model.dart';
import 'package:home_feel/features/home/data/models/homestay_suggest_model.dart';
import 'package:home_feel/features/home/data/models/homestay_detail_model.dart';
import 'package:home_feel/features/home/data/models/room_images_model.dart';
import 'package:home_feel/features/home/data/models/room_detail_model.dart';

abstract class HomeRemoteDataSource {
  /// Lấy ảnh phòng theo mã phòng
  Future<ApiResponse<RoomImagesModel>> getRoomImages(String maPhong);
  Future<ApiResponse<HomestayTienNghiResponseModel>> getHomestayTienNghi(
    String id,
  );
  Future<ApiResponse<HomestayImageResponseModel>> getHomestayImages(String id);
  Future<ApiResponse<List<HomestayModel>>> fetchHomestays();
  Future<ApiResponse<List<HomestaySearchModel>>> searchHomestayByKeyword(
    String keyword,
  );
  Future<ApiResponse<List<HomestaySuggestModel>>> getSuggestedHomestays(
    String prefix,
  );
  Future<ApiResponse<HomestayDetailModel>> getHomestayDetail(String id);

  Future<ApiResponse<List<AvailableRoomModel>>> fetchAvailableRooms({
    required String homestayId,
    required DateTime checkIn,
    required DateTime checkOut,
  });

  /// Lấy chi tiết phòng theo mã phòng
  Future<ApiResponse<RoomDetailModel>> getRoomDetail(String maPhong);
}

class HomeRemoteDataSourceImpl implements HomeRemoteDataSource {
  final ApiService _apiService;

  HomeRemoteDataSourceImpl(this._apiService);
  @override
  Future<ApiResponse<RoomImagesModel>> getRoomImages(String maPhong) async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.baseUrl}/api/homestays/rooms/$maPhong/images',
      );
      if (response.data is Map<String, dynamic>) {
        final images = RoomImagesModel.fromJson(
          response.data as Map<String, dynamic>,
        );
        return ApiResponse(success: true, message: 'Success', data: images);
      }
      throw Exception('Invalid response format');
    } on DioException catch (e) {
      final appException = DioExceptionMapper.map(e);
      return ApiResponse(
        success: false,
        message: appException.message,
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<List<AvailableRoomModel>>> fetchAvailableRooms({
    required String homestayId,
    required DateTime checkIn,
    required DateTime checkOut,
  }) async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.baseUrl}/api/homestays/$homestayId/available-rooms',
        queryParameters: {
          'ngayDen': checkIn.toIso8601String(),
          'ngayDi': checkOut.toIso8601String(),
        },
      );
      print('[fetchAvailableRooms] API response: \n${response.data}');
      if (response.data is List) {
        final List<AvailableRoomModel> rooms = (response.data as List)
            .map(
              (json) =>
                  AvailableRoomModel.fromJson(json as Map<String, dynamic>),
            )
            .toList();
        print('[fetchAvailableRooms] Parsed rooms: \n$rooms');
        return ApiResponse(success: true, message: 'Success', data: rooms);
      }
      throw Exception('Invalid response format');
    } on DioException catch (e) {
      final appException = DioExceptionMapper.map(e);
      return ApiResponse(
        success: false,
        message: appException.message,
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<HomestayTienNghiResponseModel>> getHomestayTienNghi(
    String id,
  ) async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.baseUrl}/api/homestays/$id/tiennghi',
      );
      if (response.data is Map<String, dynamic>) {
        final tiennghi = HomestayTienNghiResponseModel.fromJson(
          response.data as Map<String, dynamic>,
        );
        return ApiResponse(success: true, message: 'Success', data: tiennghi);
      }
      throw Exception('Invalid response format');
    } on DioException catch (e) {
      final appException = DioExceptionMapper.map(e);
      return ApiResponse(
        success: false,
        message: appException.message,
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<HomestayImageResponseModel>> getHomestayImages(
    String id,
  ) async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.baseUrl}/api/homestays/$id/images',
      );
      if (response.data is Map<String, dynamic>) {
        final images = HomestayImageResponseModel.fromJson(
          response.data as Map<String, dynamic>,
        );
        return ApiResponse(success: true, message: 'Success', data: images);
      }
      throw Exception('Invalid response format');
    } on DioException catch (e) {
      final appException = DioExceptionMapper.map(e);
      return ApiResponse(
        success: false,
        message: appException.message,
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<HomestayDetailModel>> getHomestayDetail(String id) async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.baseUrl}/api/homestays/$id',
      );
      if (response.data is Map<String, dynamic>) {
        final detail = HomestayDetailModel.fromJson(
          response.data as Map<String, dynamic>,
        );
        return ApiResponse(success: true, message: 'Success', data: detail);
      }
      throw Exception('Invalid response format');
    } on DioException catch (e) {
      final appException = DioExceptionMapper.map(e);
      return ApiResponse(
        success: false,
        message: appException.message,
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<List<HomestayModel>>> fetchHomestays() async {
    try {
      final response = await _apiService.get(ApiConstants.homestays);

      print('API Response: ${response.data}'); // Debug log

      if (response.data is List) {
        final List<HomestayModel> homestays = (response.data as List)
            .map((json) => HomestayModel.fromJson(json as Map<String, dynamic>))
            .toList();

        return ApiResponse(success: true, message: 'Success', data: homestays);
      }

      throw Exception('Invalid response format');
    } on DioException catch (e) {
      final appException = DioExceptionMapper.map(e);
      return ApiResponse(
        success: false,
        message: appException.message,
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<List<HomestaySearchModel>>> searchHomestayByKeyword(
    String keyword,
  ) async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.baseUrl}/api/search/keyword',
        queryParameters: {'keyword': keyword},
      );

      if (response.data is List) {
        final List<HomestaySearchModel> searchResults = (response.data as List)
            .map(
              (json) =>
                  HomestaySearchModel.fromJson(json as Map<String, dynamic>),
            )
            .toList();

        return ApiResponse(
          success: true,
          message: 'Success',
          data: searchResults,
        );
      }

      throw Exception('Invalid response format');
    } on DioException catch (e) {
      final appException = DioExceptionMapper.map(e);
      return ApiResponse(
        success: false,
        message: appException.message,
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<List<HomestaySuggestModel>>> getSuggestedHomestays(
    String prefix,
  ) async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.baseUrl}/api/search/suggest',
        queryParameters: {'prefix': prefix},
      );

      if (response.data is List) {
        final List<HomestaySuggestModel> suggestions = (response.data as List)
            .map(
              (json) =>
                  HomestaySuggestModel.fromJson(json as Map<String, dynamic>),
            )
            .toList();

        return ApiResponse(
          success: true,
          message: 'Success',
          data: suggestions,
        );
      }

      throw Exception('Invalid response format');
    } on DioException catch (e) {
      final appException = DioExceptionMapper.map(e);
      return ApiResponse(
        success: false,
        message: appException.message,
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<RoomDetailModel>> getRoomDetail(String maPhong) async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.baseUrl}/api/homestays/rooms/$maPhong/detail',
      );

      if (response.data != null) {
        final RoomDetailModel roomDetail = RoomDetailModel.fromJson(
          response.data as Map<String, dynamic>,
        );

        return ApiResponse(success: true, message: 'Success', data: roomDetail);
      }

      throw Exception('Invalid response format');
    } on DioException catch (e) {
      final appException = DioExceptionMapper.map(e);
      return ApiResponse(
        success: false,
        message: appException.message,
        data: null,
      );
    }
  }
}
