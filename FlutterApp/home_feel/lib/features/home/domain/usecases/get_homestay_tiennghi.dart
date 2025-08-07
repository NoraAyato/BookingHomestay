import 'package:home_feel/shared/models/api_response.dart';
import 'package:home_feel/features/home/data/models/homestay_tiennghi_response_model.dart';
import 'package:home_feel/features/home/domain/repositories/home_repository.dart';

class GetHomestayTienNghi {
  final HomeRepository repository;
  GetHomestayTienNghi(this.repository);

  Future<ApiResponse<HomestayTienNghiResponseModel>> call(String id) {
    return repository.getHomestayTienNghi(id);
  }
}
