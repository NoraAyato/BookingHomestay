abstract class AuthEvent {}

class LoginEvent extends AuthEvent {
  final String email;
  final String password;
  final bool rememberMe;

  LoginEvent({
    required this.email,
    required this.password,
    this.rememberMe = false,
  });
}

class RegisterEvent extends AuthEvent {
  final String email;
  final String password;
  final String firstName;
  final String lastName;

  RegisterEvent({
    required this.email,
    required this.password,
    required this.firstName,
    required this.lastName,
  });
}

class GoogleLoginEvent extends AuthEvent {
  final String idToken;
  final String email;
  final String name;
  final String? picture;

  GoogleLoginEvent({
    required this.idToken,
    required this.email,
    required this.name,
    this.picture,
  });
}

class RefreshTokenEvent extends AuthEvent {
  final String refreshToken;

  RefreshTokenEvent({required this.refreshToken});
}

class ChangePasswordEvent extends AuthEvent {
  final String currentPassword;
  final String newPassword;
  final String rePassword;

  ChangePasswordEvent({
    required this.currentPassword,
    required this.newPassword,
    required this.rePassword,
  });
}

class ForgotPasswordEvent extends AuthEvent {
  final String email;

  ForgotPasswordEvent({required this.email});
}

class VerifyOtpEvent extends AuthEvent {
  final String email;
  final String otp;

  VerifyOtpEvent({required this.email, required this.otp});
}

class ResetPasswordEvent extends AuthEvent {
  final String token;
  final String newPassword;

  ResetPasswordEvent({required this.token, required this.newPassword});
}

class LogoutEvent extends AuthEvent {}

class CheckAuthStatusEvent extends AuthEvent {}

class RequireLoginEvent extends AuthEvent {}
