import 'package:home_feel/shared/models/api_response.dart';
import '../../../data/models/news_model.dart';
import '../news_repository.dart';

class GetAllNewsUseCase {
  final NewsRepository _repository;

  GetAllNewsUseCase(this._repository);

  Future<ApiResponse<List<NewsModel>>> call() async {
    return await _repository.getAllNews();
  }
}
