import 'package:home_feel/features/auth/domain/entities/auth_response.dart';
import 'package:home_feel/features/auth/domain/repositories/auth_repository.dart';

class LoginUser {
  final AuthRepository repository;

  LoginUser(this.repository);

  Future<AuthResponse> call(String email, String password) {
    return repository.login(email, password);
  }
}
