import 'app_exception.dart';

class AuthException extends AppException {
  final bool shouldLogout;

  AuthException({required String message, this.shouldLogout = false})
    : super(message);
}
