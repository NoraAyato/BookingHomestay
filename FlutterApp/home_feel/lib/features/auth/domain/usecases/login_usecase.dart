import '../repositories/auth_repository.dart';
import '../../data/models/auth_response.dart';

class LoginUseCase {
  final AuthRepository repository;

  LoginUseCase(this.repository);

  Future<AuthResponse> call(String email, String password, {bool rememberMe = false}) async {
    return await repository.login(email, password, rememberMe: rememberMe);
  }
} 