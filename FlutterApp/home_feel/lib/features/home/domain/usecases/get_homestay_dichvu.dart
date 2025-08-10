import 'package:home_feel/shared/models/api_response.dart';
import 'package:home_feel/features/home/data/models/homestay_dichvu_response_model.dart';
import 'package:home_feel/features/home/domain/repositories/home_repository.dart';

class GetHomestayDichVu {
  final HomeRepository repository;
  GetHomestayDichVu(this.repository);

  Future<ApiResponse<HomestayDichVuResponseModel>> call(String id) {
    return repository.getHomestayDichVu(id);
  }
}
