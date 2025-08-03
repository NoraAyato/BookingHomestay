import '../repositories/location_repository.dart';
import '../../data/models/location_model.dart';

class FetchWardsByDistrictUseCase {
  final LocationRepository _repository;

  FetchWardsByDistrictUseCase(this._repository);

  Future<List<LocationModel>> call(int districtId) async {
    return _repository.fetchWardsByDistrict(districtId);
  }
}
