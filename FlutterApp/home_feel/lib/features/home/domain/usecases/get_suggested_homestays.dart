import 'package:home_feel/features/home/data/models/homestay_suggest_model.dart';
import 'package:home_feel/features/home/domain/repositories/home_repository.dart';

class GetSuggestedHomestays {
  final HomeRepository repository;
  GetSuggestedHomestays(this.repository);

  Future<List<HomestaySuggestModel>> call(String prefix) {
    return repository.suggestHomestays(prefix);
  }
}
