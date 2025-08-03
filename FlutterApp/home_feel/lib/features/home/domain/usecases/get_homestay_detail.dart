import 'package:home_feel/core/models/api_response.dart';
import 'package:home_feel/features/home/data/models/homestay_detail_model.dart';
import 'package:home_feel/features/home/domain/repositories/home_repository.dart';

class GetHomestayDetail {
  final HomeRepository repository;
  GetHomestayDetail(this.repository);

  Future<ApiResponse<HomestayDetailModel>> call(String id) {
    return repository.getHomestayDetail(id);
  }
}
