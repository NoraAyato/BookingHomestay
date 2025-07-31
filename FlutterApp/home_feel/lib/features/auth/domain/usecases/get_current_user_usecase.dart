import 'package:home_feel/features/auth/data/models/user_info.dart';
import '../repositories/auth_repository.dart';

class GetCurrentUserUseCase {
  final AuthRepository repository;
  GetCurrentUserUseCase(this.repository);

  Future<UserInfo> call(String accessToken) async {
    return await repository.getCurrentUser(accessToken);
  }
}
