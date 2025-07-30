import '../repositories/auth_repository.dart';
import '../../data/models/auth_response.dart';

class VerifyOtpUseCase {
  final AuthRepository repository;

  VerifyOtpUseCase(this.repository);

  Future<AuthResponse> call(String email, String otp) async {
    return await repository.verifyOtp(email, otp);
  }
} 