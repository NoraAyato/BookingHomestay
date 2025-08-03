import 'package:home_feel/core/models/api_response.dart';
import 'package:home_feel/features/auth/data/models/auth_data.dart';

import '../repositories/auth_repository.dart';

class GoogleLoginUseCase {
  final AuthRepository repository;

  GoogleLoginUseCase(this.repository);

  Future<ApiResponse<AuthData>> call(
    String idToken,
    String email,
    String name,
    String? picture,
  ) async {
    return await repository.googleLogin(idToken, email, name, picture);
  }
}
