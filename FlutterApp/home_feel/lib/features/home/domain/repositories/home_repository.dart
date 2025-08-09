import 'package:home_feel/features/home/data/models/homestay_tiennghi_response_model.dart';
import 'package:home_feel/shared/models/api_response.dart';
import 'package:home_feel/features/home/data/models/homestay_detail_model.dart';
import 'package:home_feel/features/home/data/models/homestay_model.dart';
import 'package:home_feel/features/home/data/models/homestay_search_model.dart';
import 'package:home_feel/features/home/data/models/homestay_suggest_model.dart';
import 'package:home_feel/features/home/data/models/homestay_image_response_model.dart';
import 'package:home_feel/features/home/data/models/room_detail_model.dart';

import 'package:home_feel/features/home/data/models/available_room_model.dart';

import 'package:home_feel/features/home/data/models/room_images_model.dart';

abstract class HomeRepository {
  /// Lấy ảnh phòng theo mã phòng
  Future<ApiResponse<RoomImagesModel>> getRoomImages(String maPhong);
  Future<ApiResponse<HomestayTienNghiResponseModel>> getHomestayTienNghi(
    String id,
  );
  Future<ApiResponse<HomestayImageResponseModel>> getHomestayImages(String id);
  Future<ApiResponse<List<HomestayModel>>> fetchHomestays({
    String? location,
    String? filterType,
  });
  Future<List<HomestaySearchModel>> searchHomestaysByKeyword(String keyword);
  Future<List<HomestaySuggestModel>> suggestHomestays(String prefix);
  Future<ApiResponse<HomestayDetailModel>> getHomestayDetail(String id);

  /// Lấy danh sách phòng còn trống theo homestayId, checkIn, checkOut
  Future<ApiResponse<List<AvailableRoomModel>>> fetchAvailableRooms({
    required String homestayId,
    required DateTime checkIn,
    required DateTime checkOut,
  });

  /// Lấy chi tiết phòng theo mã phòng
  Future<ApiResponse<RoomDetailModel>> getRoomDetail(String maPhong);
}
