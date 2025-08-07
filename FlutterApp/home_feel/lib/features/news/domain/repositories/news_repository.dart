import 'package:home_feel/shared/models/api_response.dart';
import '../../data/models/news_model.dart';
import '../../data/models/news_detail_model.dart';

abstract class NewsRepository {
  Future<ApiResponse<List<NewsModel>>> getAllNews();
  Future<ApiResponse<NewsDetailModel>> getNewsDetail(String maTinTuc);
}
