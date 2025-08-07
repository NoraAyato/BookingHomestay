import 'package:home_feel/features/home/data/models/available_room_model.dart';
import 'package:home_feel/features/home/domain/repositories/home_repository.dart';
import 'package:home_feel/shared/models/api_response.dart';

class GetAvailableRoomsUseCase {
  final HomeRepository repository;
  GetAvailableRoomsUseCase(this.repository);

  Future<ApiResponse<List<AvailableRoomModel>>> call({
    required String homestayId,
    required DateTime checkIn,
    required DateTime checkOut,
  }) {
    return repository.fetchAvailableRooms(
      homestayId: homestayId,
      checkIn: checkIn,
      checkOut: checkOut,
    );
  }
}
