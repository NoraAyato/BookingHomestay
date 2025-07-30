import '../repositories/auth_repository.dart';
import '../../data/models/auth_response.dart';

class ChangePasswordUseCase {
  final AuthRepository repository;

  ChangePasswordUseCase(this.repository);

  Future<AuthResponse> call(String currentPassword, String newPassword, String rePassword) async {
    return await repository.changePassword(currentPassword, newPassword, rePassword);
  }
} 