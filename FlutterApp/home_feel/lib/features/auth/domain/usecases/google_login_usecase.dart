import '../repositories/auth_repository.dart';
import '../../data/models/auth_response.dart';

class GoogleLoginUseCase {
  final AuthRepository repository;

  GoogleLoginUseCase(this.repository);

  Future<AuthResponse> call(String idToken, String email, String name, String? picture) async {
    return await repository.googleLogin(idToken, email, name, picture);
  }
} 