import 'package:home_feel/core/models/api_response.dart';
import '../../domain/repositories/user_repository.dart';
import '../datasources/user_remote_data_source.dart';

class UserRepositoryImpl implements UserRepository {
  final UserRemoteDataSource remoteDataSource;
  UserRepositoryImpl(this.remoteDataSource);

  @override
  Future<ApiResponse> uploadAvatar(String token, String filePath) async {
    return await remoteDataSource.uploadAvatar(
      filePath: filePath,
      accessToken: token,
    );
  }

  @override
  Future<ApiResponse> updateProfile({
    required String token,
    required String userName,
    required String phoneNumber,
    required bool gender,
    required DateTime birthday,
  }) {
    return remoteDataSource.updateProfile(
      accessToken: token,
      userName: userName,
      phoneNumber: phoneNumber,
      gender: gender,
      birthday: birthday,
    );
  }
}
