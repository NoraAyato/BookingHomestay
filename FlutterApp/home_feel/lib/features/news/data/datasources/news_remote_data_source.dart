import 'package:home_feel/shared/models/api_response.dart';
import 'package:home_feel/core/services/api_service.dart';
import 'package:home_feel/core/network/dio_exception_mapper.dart';
import 'package:dio/dio.dart';
import '../models/news_model.dart';
import '../models/news_detail_model.dart';
import 'package:home_feel/core/constants/api.dart';

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
      final response = await _apiService.get(
        '${ApiConstants.baseUrl}/api/news',
      );
      return ApiResponse<List<NewsModel>>.fromJson(
        response.data,
        (data) =>
            (data as List).map((item) => NewsModel.fromJson(item)).toList(),
      );
    } on DioException catch (e) {
      final appException = DioExceptionMapper.map(e);
      return ApiResponse(
        success: false,
        message: appException.message,
        data: null,
      );
    }
  }

  @override
  Future<ApiResponse<NewsDetailModel>> getNewsDetail(String maTinTuc) async {
    try {
      final response = await _apiService.get(
        '${ApiConstants.baseUrl}/api/news/$maTinTuc',
      );
      return ApiResponse<NewsDetailModel>.fromJson(
        response.data,
        (data) => NewsDetailModel.fromJson(data),
      );
    } on DioException catch (e) {
      final appException = DioExceptionMapper.map(e);
      return ApiResponse(
        success: false,
        message: appException.message,
        data: null,
      );
    }
  }
}
