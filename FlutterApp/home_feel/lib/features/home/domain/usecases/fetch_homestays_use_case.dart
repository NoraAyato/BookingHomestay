import 'package:home_feel/shared/models/api_response.dart';
import 'package:home_feel/features/home/data/models/homestay_model.dart';
import 'package:home_feel/features/home/domain/repositories/home_repository.dart';

class FetchHomestaysUseCase {
  final HomeRepository repository;

  FetchHomestaysUseCase(this.repository);

  Future<ApiResponse<List<HomestayModel>>> call({
    String? location,
    String? filterType,
  }) async {
    return await repository.fetchHomestays(
      location: location,
      filterType: filterType,
    );
  }
}
