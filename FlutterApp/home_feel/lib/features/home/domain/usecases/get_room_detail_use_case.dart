import 'package:home_feel/features/home/data/models/room_detail_model.dart';
import 'package:home_feel/features/home/domain/repositories/home_repository.dart';
import 'package:home_feel/shared/models/api_response.dart';

class GetRoomDetailUseCase {
  final HomeRepository repository;

  GetRoomDetailUseCase(this.repository);

  Future<ApiResponse<RoomDetailModel>> call(String maPhong) async {
    return await repository.getRoomDetail(maPhong);
  }
}
