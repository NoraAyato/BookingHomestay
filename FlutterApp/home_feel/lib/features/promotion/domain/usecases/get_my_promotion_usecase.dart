import '../../data/models/promotion_model.dart';
import '../../data/datasources/promotion_remote_data_source.dart';

class GetMyPromotionUseCase {
  final PromotionRemoteDataSource remoteDataSource;

  GetMyPromotionUseCase(this.remoteDataSource);

  Future<List<PromotionModel>?> call({
    required String maPDPhong,
    required DateTime ngayDen,
    required DateTime ngayDi,
  }) async {
    final response = await remoteDataSource.getMyPromotion(
      maPDPhong: maPDPhong,
      ngayDen: ngayDen,
      ngayDi: ngayDi,
    );
    if (response.success && response.data != null) {
      return response.data;
    }
    return null;
  }
}
