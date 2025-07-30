import '../repositories/auth_repository.dart';
import '../../data/models/auth_response.dart';

class RefreshTokenUseCase {
  final AuthRepository repository;

  RefreshTokenUseCase(this.repository);

  Future<AuthResponse> call(String refreshToken) async {
    return await repository.refreshToken(refreshToken);
  }
} 