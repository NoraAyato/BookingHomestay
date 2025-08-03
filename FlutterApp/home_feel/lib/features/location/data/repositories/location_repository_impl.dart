import 'package:home_feel/features/location/domain/repositories/location_repository.dart';
import '../datasources/location_remote_data_source.dart';
import '../models/location_model.dart';

class LocationRepositoryImpl implements LocationRepository {
  final LocationRemoteDataSource _remoteDataSource;

  LocationRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<LocationModel>> fetchLocations() async {
    try {
      return await _remoteDataSource.fetchLocations();
    } catch (e) {
      throw Exception('Failed to fetch locations: $e');
    }
  }

  @override
  Future<List<LocationModel>> fetchDistrictsByProvince(int provinceId) async {
    try {
      return await _remoteDataSource.fetchDistrictsByProvince(provinceId);
    } catch (e) {
      throw Exception('Failed to fetch districts: $e');
    }
  }

  @override
  Future<List<LocationModel>> fetchProvinces() async {
    try {
      return await _remoteDataSource.fetchProvinces();
    } catch (e) {
      throw Exception('Failed to fetch provinces: $e');
    }
  }

  @override
  Future<List<LocationModel>> fetchWardsByDistrict(int districtId) async {
    try {
      return await _remoteDataSource.fetchWardsByDistrict(districtId);
    } catch (e) {
      throw Exception('Failed to fetch wards: $e');
    }
  }

  @override
  Future<LocationModel?> getLocationById(int id) async {
    try {
      return await _remoteDataSource.getLocationById(id);
    } catch (e) {
      throw Exception('Failed to fetch location details: $e');
    }
  }
}
