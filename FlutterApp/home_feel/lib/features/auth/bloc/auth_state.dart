import 'package:home_feel/features/auth/data/models/auth_response.dart';

abstract class AuthState {}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthSuccess extends AuthState {
  final AuthResponse authResponse;

  AuthSuccess(this.authResponse);
}

class AuthFailure extends AuthState {
  final String message;

  AuthFailure(this.message);
}

class AuthLoggedOut extends AuthState {}
