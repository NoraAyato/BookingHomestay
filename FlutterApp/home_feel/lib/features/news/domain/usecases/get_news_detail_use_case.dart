import 'package:home_feel/core/models/api_response.dart';
import '../../data/models/news_detail_model.dart';
import '../repositories/news_repository.dart';

class GetNewsDetailUseCase {
  final NewsRepository _repository;

  GetNewsDetailUseCase(this._repository);

  Future<ApiResponse<NewsDetailModel>> call(String maTinTuc) async {
    return await _repository.getNewsDetail(maTinTuc);
  }
}
