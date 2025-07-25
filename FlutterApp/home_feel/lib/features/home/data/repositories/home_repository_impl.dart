import 'package:dio/dio.dart';
import 'package:home_feel/core/constants/api.dart';
import 'package:home_feel/core/services/api_service.dart';
import '../models/homestay_model.dart';

class HomeRepositoryImpl {
  final ApiService apiService;

  HomeRepositoryImpl(this.apiService);

  Future<List<HomestayModel>> fetchHomestays({
    String? location,
    String? filterType,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (location != null) queryParams['location'] = location;
      if (filterType != null) queryParams['type'] = filterType;
      final response = await apiService.get(
        ApiConstants.homestays,
        queryParameters: queryParams,
      );
      return (response.data as List)
          .map((json) => HomestayModel.fromJson(json))
          .toList();
    } catch (e) {
      throw Exception('Failed to fetch homestays: $e');
    }
  }
}
