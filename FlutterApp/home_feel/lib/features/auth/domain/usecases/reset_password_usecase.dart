import '../repositories/auth_repository.dart';
import '../../data/models/auth_response.dart';

class ResetPasswordUseCase {
  final AuthRepository repository;

  ResetPasswordUseCase(this.repository);

  Future<AuthResponse> call(String token, String newPassword) async {
    return await repository.resetPassword(token, newPassword);
  }
} 