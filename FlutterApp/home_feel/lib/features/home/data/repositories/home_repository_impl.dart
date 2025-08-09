import 'package:home_feel/features/home/data/models/homestay_tiennghi_response_model.dart';
import 'package:home_feel/features/home/data/models/homestay_image_response_model.dart';
import 'package:home_feel/shared/models/api_response.dart';
import 'package:home_feel/features/home/data/models/homestay_search_model.dart';
import 'package:home_feel/features/home/data/models/homestay_suggest_model.dart';
import 'package:home_feel/features/home/data/models/room_images_model.dart';
import 'package:home_feel/features/home/domain/repositories/home_repository.dart';
import 'package:home_feel/features/home/data/datasources/home_remote_data_source.dart';
import 'package:home_feel/features/home/data/models/homestay_model.dart';
import 'package:home_feel/features/home/data/models/homestay_detail_model.dart';
import 'package:home_feel/features/home/data/models/room_detail_model.dart';

import 'package:home_feel/features/home/data/models/available_room_model.dart';

class HomeRepositoryImpl implements HomeRepository {
  @override
  Future<ApiResponse<RoomImagesModel>> getRoomImages(String maPhong) {
    return _remoteDataSource.getRoomImages(maPhong);
  }

  @override
  Future<ApiResponse<List<AvailableRoomModel>>> fetchAvailableRooms({
    required String homestayId,
    required DateTime checkIn,
    required DateTime checkOut,
  }) {
    return _remoteDataSource.fetchAvailableRooms(
      homestayId: homestayId,
      checkIn: checkIn,
      checkOut: checkOut,
    );
  }

  @override
  Future<ApiResponse<HomestayTienNghiResponseModel>> getHomestayTienNghi(
    String id,
  ) {
    return _remoteDataSource.getHomestayTienNghi(id);
  }

  @override
  Future<ApiResponse<HomestayImageResponseModel>> getHomestayImages(String id) {
    return _remoteDataSource.getHomestayImages(id);
  }

  @override
  Future<ApiResponse<HomestayDetailModel>> getHomestayDetail(String id) {
    return _remoteDataSource.getHomestayDetail(id);
  }

  final HomeRemoteDataSource _remoteDataSource;

  HomeRepositoryImpl(this._remoteDataSource);

  @override
  Future<ApiResponse<List<HomestayModel>>> fetchHomestays({
    String? location,
    String? filterType,
  }) async {
    return await _remoteDataSource.fetchHomestays();
  }

  @override
  Future<List<HomestaySearchModel>> searchHomestaysByKeyword(String keyword) {
    return _remoteDataSource
        .searchHomestayByKeyword(keyword)
        .then((response) => response.data ?? []);
  }

  @override
  Future<List<HomestaySuggestModel>> suggestHomestays(String prefix) {
    return _remoteDataSource
        .getSuggestedHomestays(prefix)
        .then((response) => response.data ?? []);
  }

  @override
  Future<ApiResponse<RoomDetailModel>> getRoomDetail(String maPhong) {
    return _remoteDataSource.getRoomDetail(maPhong);
  }
}
