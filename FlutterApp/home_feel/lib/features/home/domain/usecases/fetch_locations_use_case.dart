import '../../data/models/location_model.dart';
import '../../data/repositories/location_repository_impl.dart';

class FetchLocationsUseCase {
  final LocationRepositoryImpl repository;

  FetchLocationsUseCase(this.repository);

  Future<List<LocationModel>> call() async {
    return await repository.fetchLocations();
  }
}
