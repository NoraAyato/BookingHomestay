import 'package:home_feel/core/models/api_response.dart';
import 'package:home_feel/features/auth/data/models/auth_data.dart';

import '../repositories/auth_repository.dart';

class ChangePasswordUseCase {
  final AuthRepository repository;

  ChangePasswordUseCase(this.repository);

  Future<ApiResponse<AuthData>> call(
    String currentPassword,
    String newPassword,
    String rePassword,
  ) async {
    return await repository.changePassword(
      currentPassword,
      newPassword,
      rePassword,
    );
  }
}
