import 'package:home_feel/core/models/api_response.dart';
import 'package:home_feel/features/auth/data/models/auth_data.dart';

import '../repositories/auth_repository.dart';

class VerifyOtpUseCase {
  final AuthRepository repository;

  VerifyOtpUseCase(this.repository);

  Future<ApiResponse<AuthData>> call(String email, String otp) async {
    return await repository.verifyOtp(email, otp);
  }
}
