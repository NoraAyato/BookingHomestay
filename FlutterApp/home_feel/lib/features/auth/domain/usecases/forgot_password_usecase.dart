import 'package:home_feel/core/models/api_response.dart';
import 'package:home_feel/features/auth/data/models/auth_data.dart';

import '../repositories/auth_repository.dart';

class ForgotPasswordUseCase {
  final AuthRepository repository;

  ForgotPasswordUseCase(this.repository);

  Future<ApiResponse<AuthData>> call(String email) async {
    return await repository.forgotPassword(email);
  }
}
