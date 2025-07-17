import 'package:home_feel/features/auth/domain/usecases/login_user.dart';
import 'package:home_feel/features/auth/domain/usecases/register_user.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_event.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUser loginUser;
  final RegisterUser registerUser;

  AuthBloc({required this.loginUser, required this.registerUser})
    : super(AuthInitial()) {
    on<LoginEvent>((event, emit) async {
      emit(AuthLoading());
      try {
        final response = await loginUser(event.email, event.password);
        if (response.accessToken != null) {
          emit(AuthSuccess(response.accessToken!)); // Thành công
        } else if (response.errorMessage != null) {
          emit(AuthError(response.errorMessage!)); // Lỗi từ API
        } else {
          emit(AuthError('Unknown error occurred'));
        }
      } catch (e) {
        emit(AuthError('Login failed: ${e.toString()}'));
      }
    });

    on<RegisterEvent>((event, emit) async {
      emit(AuthLoading());
      try {
        final response = await registerUser(
          event.email,
          event.password,
          event.firstName,
          event.lastName,
        );
        if (response.accessToken != null) {
          emit(AuthSuccess(response.accessToken!)); // Thành công
        } else if (response.errorMessage != null) {
          emit(AuthError(response.errorMessage!)); // Lỗi từ API
        } else {
          emit(AuthError('Unknown error occurred'));
        }
      } catch (e) {
        emit(AuthError('Register failed: ${e.toString()}'));
      }
    });
  }
}
