import 'package:home_feel/shared/models/api_response.dart';
import 'package:home_feel/features/auth/data/models/auth_data.dart';

import '../repositories/auth_repository.dart';

class LoginUseCase {
  final AuthRepository repository;

  LoginUseCase(this.repository);

  Future<ApiResponse<AuthData>> call(
    String email,
    String password, {
    bool rememberMe = false,
  }) async {
    return await repository.login(email, password, rememberMe: rememberMe);
  }
}
