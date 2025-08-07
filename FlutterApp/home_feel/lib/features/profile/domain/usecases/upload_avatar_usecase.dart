import 'package:home_feel/shared/models/api_response.dart';
import '../repositories/user_repository.dart';

class UploadAvatarUseCase {
  final UserRepository repository;

  UploadAvatarUseCase(this.repository);

  Future<ApiResponse> call(String filePath) async {
    return await repository.uploadAvatar(filePath);
  }
}
