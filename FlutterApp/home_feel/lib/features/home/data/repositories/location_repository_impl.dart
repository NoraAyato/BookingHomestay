import 'package:dio/dio.dart';
import 'package:home_feel/core/constants/api.dart';
import 'package:home_feel/core/services/api_service.dart';

import '../models/location_model.dart';

class LocationRepositoryImpl {
  final ApiService apiService;

  LocationRepositoryImpl(this.apiService);

  Future<List<LocationModel>> fetchLocations() async {
    try {
      final response = await apiService.get(ApiConstants.locations);
      return (response.data as List)
          .map((json) => LocationModel.fromJson(json))
          .toList();
    } catch (e) {
      throw Exception('Failed to fetch locations: $e');
    }
  }
}
