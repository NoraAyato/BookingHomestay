import 'package:home_feel/features/auth/data/models/auth_data.dart';

import '../repositories/auth_repository.dart';

import 'package:home_feel/shared/models/api_response.dart';
class RefreshTokenUseCase {
  final AuthRepository repository;

  RefreshTokenUseCase(this.repository);

  Future<ApiResponse<AuthData>> call(String refreshToken) async {
    return await repository.refreshToken(refreshToken);
  }
} 