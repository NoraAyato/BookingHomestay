import 'package:home_feel/features/home/data/models/room_images_model.dart';
import 'package:home_feel/features/home/domain/repositories/home_repository.dart';
import 'package:home_feel/shared/models/api_response.dart';

class GetRoomImagesUseCase {
  final HomeRepository repository;
  GetRoomImagesUseCase(this.repository);

  Future<ApiResponse<RoomImagesModel>> call(String maPhong) {
    return repository.getRoomImages(maPhong);
  }
}
