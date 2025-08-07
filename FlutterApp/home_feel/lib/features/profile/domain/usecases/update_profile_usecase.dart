import 'package:home_feel/shared/models/api_response.dart';
import '../repositories/user_repository.dart';

class UpdateProfileUseCase {
  final UserRepository repository;

  UpdateProfileUseCase(this.repository);

  Future<ApiResponse> call({
    required String userName,
    required String phoneNumber,
    required bool gender,
    required DateTime birthday,
  }) async {
    return await repository.updateProfile(
      userName: userName,
      phoneNumber: phoneNumber,
      gender: gender,
      birthday: birthday,
    );
  }
}
