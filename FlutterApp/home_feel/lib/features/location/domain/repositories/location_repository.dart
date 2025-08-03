import '../../data/models/location_model.dart';

abstract class LocationRepository {
  /// Lấy danh sách tất cả các địa điểm
  Future<List<LocationModel>> fetchLocations();

  /// Lấy danh sách các tỉnh/thành phố
  Future<List<LocationModel>> fetchProvinces();

  /// Lấy danh sách quận/huyện theo tỉnh/thành phố
  Future<List<LocationModel>> fetchDistrictsByProvince(int provinceId);

  /// Lấy danh sách phường/xã theo quận/huyện
  Future<List<LocationModel>> fetchWardsByDistrict(int districtId);

  /// Lấy thông tin chi tiết một địa điểm
  Future<LocationModel?> getLocationById(int id);
}
