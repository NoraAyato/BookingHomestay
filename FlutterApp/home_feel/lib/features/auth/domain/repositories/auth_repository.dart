import 'package:home_feel/features/auth/domain/entities/auth_response.dart';

abstract class AuthRepository {
  Future<AuthResponse> login(String email, String password);
  Future<AuthResponse> register(
    String email,
    String password,
    String firstName,
    String lastName,
  );
}
