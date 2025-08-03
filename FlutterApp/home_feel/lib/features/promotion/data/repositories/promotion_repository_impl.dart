import 'package:home_feel/core/models/api_response.dart';
import '../datasources/promotion_remote_data_source.dart';
import '../models/promotion_model.dart';

abstract class PromotionRepository {
  Future<ApiResponse<List<PromotionModel>>> getAdminKhuyenMai();
  Future<ApiResponse<PromotionModel>> getKhuyenMaiById(String kmId);
}

class PromotionRepositoryImpl implements PromotionRepository {
  final PromotionRemoteDataSource _remoteDataSource;

  PromotionRepositoryImpl(this._remoteDataSource);

  @override
  Future<ApiResponse<List<PromotionModel>>> getAdminKhuyenMai() {
    return _remoteDataSource.getAdminKhuyenMai();
  }

  @override
  Future<ApiResponse<PromotionModel>> getKhuyenMaiById(String kmId) {
    return _remoteDataSource.getKhuyenMaiById(kmId);
  }
}
