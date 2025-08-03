import '../repositories/location_repository.dart';
import '../../data/models/location_model.dart';

class GetLocationByIdUseCase {
  final LocationRepository _repository;

  GetLocationByIdUseCase(this._repository);

  Future<LocationModel?> call(int id) async {
    return _repository.getLocationById(id);
  }
}
