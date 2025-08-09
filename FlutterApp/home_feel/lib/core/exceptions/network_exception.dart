import 'package:home_feel/core/exceptions/app_exception.dart';

class NetworkException extends AppException {
  NetworkException(String message) : super(message);
}

class AuthException extends AppException {
  final bool shouldLogout;

  AuthException(String message, {this.shouldLogout = false}) : super(message);
}

class ServerException extends AppException {
  ServerException(String message, {int? code}) : super(message, code: code);
}
