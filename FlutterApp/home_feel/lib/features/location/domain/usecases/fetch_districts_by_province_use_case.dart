import '../repositories/location_repository.dart';
import '../../data/models/location_model.dart';

class FetchDistrictsByProvinceUseCase {
  final LocationRepository _repository;

  FetchDistrictsByProvinceUseCase(this._repository);

  Future<List<LocationModel>> call(int provinceId) async {
    return _repository.fetchDistrictsByProvince(provinceId);
  }
}
