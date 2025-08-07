import 'package:home_feel/shared/models/api_response.dart';
import 'package:home_feel/core/services/api_service.dart';
import '../models/news_model.dart';
import '../models/news_detail_model.dart';

abstract class NewsRemoteDataSource {
  Future<ApiResponse<List<NewsModel>>> getAllNews();
  Future<ApiResponse<NewsDetailModel>> getNewsDetail(String maTinTuc);
}

class NewsRemoteDataSourceImpl implements NewsRemoteDataSource {
  final ApiService _apiService;

  NewsRemoteDataSourceImpl(this._apiService);

  @override
  Future<ApiResponse<List<NewsModel>>> getAllNews() async {
    try {
      final response = await _apiService.get('/api/news');
      return ApiResponse<List<NewsModel>>.fromJson(
        response.data,
        (data) =>
            (data as List).map((item) => NewsModel.fromJson(item)).toList(),
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Lỗi khi lấy danh sách tin tức: $e',
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<NewsDetailModel>> getNewsDetail(String maTinTuc) async {
    try {
      final response = await _apiService.get('/api/news/$maTinTuc');
      return ApiResponse<NewsDetailModel>.fromJson(
        response.data,
        (data) => NewsDetailModel.fromJson(data),
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Lỗi khi lấy chi tiết tin tức: $e',
        data: null,
      );
    }
  }
}
