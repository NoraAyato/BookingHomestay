import 'package:home_feel/core/models/api_response.dart';
import '../repositories/user_repository.dart';

class UpdateProfileUseCase {
  final UserRepository repository;

  UpdateProfileUseCase(this.repository);

  Future<ApiResponse> call({
    required String token,
    required String userName,
    required String phoneNumber,
    required bool gender,
    required DateTime birthday,
  }) async {
    return await repository.updateProfile(
      token: token,
      userName: userName,
      phoneNumber: phoneNumber,
      gender: gender,
      birthday: birthday,
    );
  }
}
