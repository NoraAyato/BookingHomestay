import 'package:home_feel/shared/models/api_response.dart';
import '../../domain/repositories/news_repository.dart';
import '../datasources/news_remote_data_source.dart';
import '../models/news_model.dart';
import '../models/news_detail_model.dart';

class NewsRepositoryImpl implements NewsRepository {
  final NewsRemoteDataSource _remoteDataSource;

  NewsRepositoryImpl(this._remoteDataSource);

  @override
  Future<ApiResponse<List<NewsModel>>> getAllNews() async {
    return await _remoteDataSource.getAllNews();
  }

  @override
  Future<ApiResponse<NewsDetailModel>> getNewsDetail(String maTinTuc) async {
    return await _remoteDataSource.getNewsDetail(maTinTuc);
  }
}
