import 'package:dio/dio.dart';
import 'package:home_feel/core/network/dio_exception_mapper.dart';
import 'package:home_feel/core/services/api_service.dart';
import 'package:home_feel/shared/models/api_response.dart';
import '../models/promotion_model.dart';

abstract class PromotionRemoteDataSource {
  Future<ApiResponse<List<PromotionModel>>> getAdminKhuyenMai();
  Future<ApiResponse<PromotionModel>> getKhuyenMaiById(String kmId);
  Future<ApiResponse<List<PromotionModel>>> getMyPromotion({
    required String maPhong,
    required DateTime ngayDen,
    required DateTime ngayDi,
  });
}

class PromotionRemoteDataSourceImpl implements PromotionRemoteDataSource {
  final ApiService _apiService;

  PromotionRemoteDataSourceImpl(this._apiService);

  @override
  Future<ApiResponse<List<PromotionModel>>> getAdminKhuyenMai() async {
    try {
      final response = await _apiService.get('/api/promotions');
      return ApiResponse<List<PromotionModel>>.fromJson(
        response.data,
        (data) => (data as List)
            .map((item) => PromotionModel.fromJson(item))
            .toList(),
      );
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
  Future<ApiResponse<List<PromotionModel>>> getMyPromotion({
    required String maPhong,
    required DateTime ngayDen,
    required DateTime ngayDi,
  }) async {
    try {
      final response = await _apiService.post(
        '/api/promotions/my-promotion',
        data: {
          'maPhong': maPhong,
          'ngayDen': ngayDen.toIso8601String(),
          'ngayDi': ngayDi.toIso8601String(),
        },
      );
      return ApiResponse<List<PromotionModel>>.fromJson(
        response.data,
        (data) => (data as List)
            .map((item) => PromotionModel.fromJson(item))
            .toList(),
      );
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
  Future<ApiResponse<PromotionModel>> getKhuyenMaiById(String kmId) async {
    try {
      final response = await _apiService.get('/api/promotions/$kmId');
      return ApiResponse<PromotionModel>.fromJson(
        response.data,
        (data) => PromotionModel.fromJson(data),
      );
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
