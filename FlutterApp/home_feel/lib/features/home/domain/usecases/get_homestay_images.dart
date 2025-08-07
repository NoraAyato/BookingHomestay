import 'package:home_feel/shared/models/api_response.dart';
import 'package:home_feel/features/home/data/models/homestay_image_response_model.dart';
import 'package:home_feel/features/home/domain/repositories/home_repository.dart';

class GetHomestayImages {
  final HomeRepository repository;
  GetHomestayImages(this.repository);

  Future<ApiResponse<HomestayImageResponseModel>> call(String id) {
    return repository.getHomestayImages(id);
  }
}
