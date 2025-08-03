import '../repositories/location_repository.dart';
import '../../data/models/location_model.dart';

class FetchProvincesUseCase {
  final LocationRepository _repository;

  FetchProvincesUseCase(this._repository);

  Future<List<LocationModel>> call() async {
    return _repository.fetchProvinces();
  }
}
