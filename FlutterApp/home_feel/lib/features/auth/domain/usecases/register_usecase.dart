import '../repositories/auth_repository.dart';
import '../../data/models/auth_response.dart';

class RegisterUseCase {
  final AuthRepository repository;

  RegisterUseCase(this.repository);

  Future<AuthResponse> call(String email, String password, String firstName, String lastName) async {
    return await repository.register(email, password, firstName, lastName);
  }
} 