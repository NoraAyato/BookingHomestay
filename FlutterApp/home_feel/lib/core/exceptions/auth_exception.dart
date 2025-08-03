class AuthException implements Exception {
  final String message;
  final bool shouldLogout;

  AuthException({required this.message, this.shouldLogout = false});
}
