import 'package:home_feel/features/auth/data/models/auth_response.dart';
import 'package:home_feel/features/auth/data/models/user_info.dart';

abstract class AuthState {}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthSuccess extends AuthState {
  final AuthResponse authResponse;
  final UserInfo? userInfo;
  AuthSuccess(this.authResponse, this.userInfo);
}

class AuthFailure extends AuthState {
  final String message;
  final AuthResponse? error;

  AuthFailure(this.message, [this.error]);
}

class AuthLoggedOut extends AuthState {}
