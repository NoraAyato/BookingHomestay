import 'package:home_feel/features/home/data/models/homestay_tiennghi_response_model.dart';
import 'package:home_feel/features/home/data/models/homestay_image_response_model.dart';
import 'package:home_feel/core/constants/api.dart';
import 'package:home_feel/core/models/api_response.dart';
import 'package:home_feel/core/services/api_service.dart';
import 'package:home_feel/features/home/data/models/homestay_model.dart';
import 'package:home_feel/features/home/data/models/homestay_search_model.dart';
import 'package:home_feel/features/home/data/models/homestay_suggest_model.dart';
import 'package:home_feel/features/home/data/models/homestay_detail_model.dart';

abstract class HomeRemoteDataSource {
  Future<ApiResponse<HomestayTienNghiResponseModel>> getHomestayTienNghi(
    String id,
  );
  Future<ApiResponse<HomestayImageResponseModel>> getHomestayImages(String id);
  Future<ApiResponse<List<HomestayModel>>> fetchHomestays();
  Future<ApiResponse<List<HomestaySearchModel>>> searchHomestayByKeyword(
    String keyword,
  );
  Future<ApiResponse<List<HomestaySuggestModel>>> getSuggestedHomestays(
    String prefix,
  );
  Future<ApiResponse<HomestayDetailModel>> getHomestayDetail(String id);
}

class HomeRemoteDataSourceImpl implements HomeRemoteDataSource {
  @override
  Future<ApiResponse<HomestayTienNghiResponseModel>> getHomestayTienNghi(
    String id,
  ) async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.baseUrl}/api/homestays/$id/tiennghi',
      );
      if (response.data is Map<String, dynamic>) {
        final tiennghi = HomestayTienNghiResponseModel.fromJson(
          response.data as Map<String, dynamic>,
        );
        return ApiResponse(success: true, message: 'Success', data: tiennghi);
      }
      throw Exception('Invalid response format');
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Failed to get homestay tiennghi: $e',
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<HomestayImageResponseModel>> getHomestayImages(
    String id,
  ) async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.baseUrl}/api/homestays/$id/images',
      );
      if (response.data is Map<String, dynamic>) {
        final images = HomestayImageResponseModel.fromJson(
          response.data as Map<String, dynamic>,
        );
        return ApiResponse(success: true, message: 'Success', data: images);
      }
      throw Exception('Invalid response format');
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Failed to get homestay images: $e',
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<HomestayDetailModel>> getHomestayDetail(String id) async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.baseUrl}/api/homestays/$id',
      );
      if (response.data is Map<String, dynamic>) {
        final detail = HomestayDetailModel.fromJson(
          response.data as Map<String, dynamic>,
        );
        return ApiResponse(success: true, message: 'Success', data: detail);
      }
      throw Exception('Invalid response format');
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Failed to get homestay detail: $e',
        data: null,
      );
    }
  }

  final ApiService _apiService;

  HomeRemoteDataSourceImpl(this._apiService);

  @override
  Future<ApiResponse<List<HomestayModel>>> fetchHomestays() async {
    try {
      final response = await _apiService.get(ApiConstants.homestays);

      print('API Response: ${response.data}'); // Debug log

      if (response.data is List) {
        final List<HomestayModel> homestays = (response.data as List)
            .map((json) => HomestayModel.fromJson(json as Map<String, dynamic>))
            .toList();

        return ApiResponse(success: true, message: 'Success', data: homestays);
      }

      throw Exception('Invalid response format');
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Failed to fetch homestays: $e',
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<List<HomestaySearchModel>>> searchHomestayByKeyword(
    String keyword,
  ) async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.baseUrl}/api/search/keyword',
        queryParameters: {'keyword': keyword},
      );

      if (response.data is List) {
        final List<HomestaySearchModel> searchResults = (response.data as List)
            .map(
              (json) =>
                  HomestaySearchModel.fromJson(json as Map<String, dynamic>),
            )
            .toList();

        return ApiResponse(
          success: true,
          message: 'Success',
          data: searchResults,
        );
      }

      throw Exception('Invalid response format');
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Failed to search homestays: $e',
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<List<HomestaySuggestModel>>> getSuggestedHomestays(
    String prefix,
  ) async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.baseUrl}/api/search/suggest',
        queryParameters: {'prefix': prefix},
      );

      if (response.data is List) {
        final List<HomestaySuggestModel> suggestions = (response.data as List)
            .map(
              (json) =>
                  HomestaySuggestModel.fromJson(json as Map<String, dynamic>),
            )
            .toList();

        return ApiResponse(
          success: true,
          message: 'Success',
          data: suggestions,
        );
      }

      throw Exception('Invalid response format');
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Failed to get suggestions: $e',
        data: null,
      );
    }
  }
}
