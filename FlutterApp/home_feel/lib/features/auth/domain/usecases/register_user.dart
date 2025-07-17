import 'package:home_feel/features/auth/domain/entities/auth_response.dart';
import 'package:home_feel/features/auth/domain/repositories/auth_repository.dart';

class RegisterUser {
  final AuthRepository repository;

  RegisterUser(this.repository);

  Future<AuthResponse> call(
    String email,
    String password,
    String firstName,
    String lastName,
  ) {
    return repository.register(email, password, firstName, lastName);
  }
}
