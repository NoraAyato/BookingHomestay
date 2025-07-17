abstract class AuthState {}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthSuccess extends AuthState {
  final String accessToken; // Thay token bằng accessToken

  AuthSuccess(this.accessToken);
}

class AuthError extends AuthState {
  final String message;

  AuthError(this.message);
}
