import 'package:home_feel/core/models/api_response.dart';
import '../repositories/user_repository.dart';

class UploadAvatarUseCase {
  final UserRepository repository;

  UploadAvatarUseCase(this.repository);

  Future<ApiResponse> call(String token, String filePath) async {
    return await repository.uploadAvatar(token, filePath);
  }
}
