import 'package:home_feel/features/home/data/models/homestay_search_model.dart';
import 'package:home_feel/features/home/domain/repositories/home_repository.dart';

class SearchHomestayByKeyword {
  final HomeRepository repository;
  SearchHomestayByKeyword(this.repository);

  Future<List<HomestaySearchModel>> call(String keyword) {
    return repository.searchHomestaysByKeyword(keyword);
  }
}
