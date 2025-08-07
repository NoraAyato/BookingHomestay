import 'package:home_feel/shared/models/api_response.dart';
import 'package:home_feel/features/promotion/data/models/promotion_model.dart';
import 'package:home_feel/features/promotion/data/repositories/promotion_repository_impl.dart';

class GetAdminKhuyenMaiUseCase {
  final PromotionRepositoryImpl _repository;

  GetAdminKhuyenMaiUseCase(this._repository);

  Future<ApiResponse<List<PromotionModel>>> call() async {
    return await _repository.getAdminKhuyenMai();
  }
}
