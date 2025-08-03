import 'package:home_feel/features/auth/data/models/auth_data.dart';

import '../repositories/auth_repository.dart';

import 'package:home_feel/core/models/api_response.dart';

class RegisterUseCase {
  final AuthRepository repository;

  RegisterUseCase(this.repository);

  Future<ApiResponse<AuthData>> call(
    String email,
    String password,
    String firstName,
    String lastName,
  ) async {
    return await repository.register(email, password, firstName, lastName);
  }
}
