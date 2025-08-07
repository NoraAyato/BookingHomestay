import 'package:home_feel/core/services/api_service.dart';
import 'package:home_feel/shared/models/api_response.dart';
import '../models/promotion_model.dart';

abstract class PromotionRemoteDataSource {
  Future<ApiResponse<List<PromotionModel>>> getAdminKhuyenMai();
  Future<ApiResponse<PromotionModel>> getKhuyenMaiById(String kmId);
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
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Lỗi khi lấy danh sách khuyến mãi: $e',
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
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Lỗi khi lấy khuyến mãi: $e',
        data: null,
      );
    }
  }
}
