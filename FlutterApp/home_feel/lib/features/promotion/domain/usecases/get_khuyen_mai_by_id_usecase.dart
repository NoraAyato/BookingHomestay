import 'package:home_feel/shared/models/api_response.dart';
import 'package:home_feel/features/promotion/data/models/promotion_model.dart';
import 'package:home_feel/features/promotion/data/repositories/promotion_repository_impl.dart';

class GetKhuyenMaiByIdUseCase {
  final PromotionRepositoryImpl _repository;

  GetKhuyenMaiByIdUseCase(this._repository);

  Future<ApiResponse<PromotionModel>> call(String kmId) async {
    return await _repository.getKhuyenMaiById(kmId);
  }
}
