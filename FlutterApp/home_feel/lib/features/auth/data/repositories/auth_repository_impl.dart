import 'package:home_feel/features/auth/data/datasources/auth_remote_datasource.dart';
import 'package:home_feel/features/auth/domain/entities/auth_response.dart';
import 'package:home_feel/features/auth/domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource dataSource;

  AuthRepositoryImpl(this.dataSource);

  @override
  Future<AuthResponse> login(String email, String password) async {
    return await dataSource.login(email, password);
  }

  @override
  Future<AuthResponse> register(
    String email,
    String password,
    String firstName,
    String lastName,
  ) async {
    return await dataSource.register(email, password, firstName, lastName);
  }
}
