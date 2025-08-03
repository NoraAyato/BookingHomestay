import 'package:flutter_bloc/flutter_bloc.dart';

enum AuthOverlayState { none, login, register }

class AuthOverlayCubit extends Cubit<AuthOverlayState> {
  AuthOverlayCubit() : super(AuthOverlayState.none);

  void showLogin() => emit(AuthOverlayState.login);
  void showRegister() => emit(AuthOverlayState.register);
  void hide() => emit(AuthOverlayState.none);
}
