import 'package:home_feel/core/constants/api.dart';
import 'package:home_feel/core/services/api_service.dart';
import '../models/location_model.dart';

abstract class LocationRemoteDataSource {
  Future<List<LocationModel>> fetchLocations();
  Future<List<LocationModel>> fetchProvinces();
  Future<List<LocationModel>> fetchDistrictsByProvince(int provinceId);
  Future<List<LocationModel>> fetchWardsByDistrict(int districtId);
  Future<LocationModel?> getLocationById(int id);
}

class LocationRemoteDataSourceImpl implements LocationRemoteDataSource {
  final ApiService _apiService;

  LocationRemoteDataSourceImpl(this._apiService);

  @override
  Future<List<LocationModel>> fetchLocations() async {
    try {
      final response = await _apiService.get(ApiConstants.locations);
      return (response.data as List)
          .map((json) => LocationModel.fromJson(json))
          .toList();
    } catch (e) {
      throw Exception('Could not fetch locations: $e');
    }
  }

  @override
  Future<List<LocationModel>> fetchProvinces() async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.locations}/provinces',
      );
      return (response.data as List)
          .map((json) => LocationModel.fromJson(json))
          .toList();
    } catch (e) {
      throw Exception('Could not fetch provinces: $e');
    }
  }

  @override
  Future<List<LocationModel>> fetchDistrictsByProvince(int provinceId) async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.locations}/districts/$provinceId',
      );
      return (response.data as List)
          .map((json) => LocationModel.fromJson(json))
          .toList();
    } catch (e) {
      throw Exception('Could not fetch districts: $e');
    }
  }

  @override
  Future<List<LocationModel>> fetchWardsByDistrict(int districtId) async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.locations}/wards/$districtId',
      );
      return (response.data as List)
          .map((json) => LocationModel.fromJson(json))
          .toList();
    } catch (e) {
      throw Exception('Could not fetch wards: $e');
    }
  }

  @override
  Future<LocationModel?> getLocationById(int id) async {
    try {
      final response = await _apiService.get('${ApiConstants.locations}/$id');
      return LocationModel.fromJson(response.data);
    } catch (e) {
      if (e is Exception && e.toString().contains('404')) {
        return null;
      }
      throw Exception('Could not fetch location details: $e');
    }
  }
}
