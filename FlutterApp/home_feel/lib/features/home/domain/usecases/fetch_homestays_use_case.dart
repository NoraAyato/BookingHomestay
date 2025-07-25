import '../../data/models/homestay_model.dart';
import '../../data/repositories/home_repository_impl.dart';

class FetchHomestaysUseCase {
  final HomeRepositoryImpl repository;

  FetchHomestaysUseCase(this.repository);

  Future<List<HomestayModel>> call({
    String? location,
    String? filterType,
  }) async {
    return await repository.fetchHomestays(
      location: location,
      filterType: filterType,
    );
  }
}
