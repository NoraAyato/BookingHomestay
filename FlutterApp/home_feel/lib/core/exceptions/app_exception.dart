abstract class AppException implements Exception {
  final String message;
  final int? code;

  AppException(this.message, {this.code});

  @override
  String toString() => 'AppException: $message (code: $code)';
}

class RequestCancelledException extends AppException {
  RequestCancelledException(String message) : super(message);
}

class UnknownException extends AppException {
  UnknownException(String message) : super(message);
}
