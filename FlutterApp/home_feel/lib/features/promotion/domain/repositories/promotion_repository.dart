import 'package:home_feel/features/promotion/data/repositories/promotion_repository_impl.dart';
import 'package:home_feel/features/promotion/data/models/promotion_model.dart';

abstract class PromotionRepository {
  Future<List<PromotionModel>> getAdminKhuyenMai();
  Future<PromotionModel> getKhuyenMaiById(String kmId);
}
