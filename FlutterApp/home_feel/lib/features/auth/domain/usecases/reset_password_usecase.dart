import 'package:home_feel/shared/models/api_response.dart';
import 'package:home_feel/features/auth/data/models/auth_data.dart';

import '../repositories/auth_repository.dart';

class ResetPasswordUseCase {
  final AuthRepository repository;

  ResetPasswordUseCase(this.repository);

  Future<ApiResponse<AuthData>> call(String token, String newPassword) async {
    return await repository.resetPassword(token, newPassword);
  }
} 