import '../repositories/auth_repository.dart';
import '../../data/models/auth_response.dart';

class ForgotPasswordUseCase {
  final AuthRepository repository;

  ForgotPasswordUseCase(this.repository);

  Future<AuthResponse> call(String email) async {
    return await repository.forgotPassword(email);
  }
} 