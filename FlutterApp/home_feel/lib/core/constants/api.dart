// lib/core/constants/api.dart
class ApiConstants {
  static const String baseUrl = 'http://192.168.1.130:8080';

  // Home endpoints
  static const String homestays = '/api/homestays';
  static const String searchSuggestions = '/search/suggestions';
  static const String bookings = '/bookings';
  static const String promotions = '/promotions';
  static const String profile = '/profile';
  static const String locations = '/api/locations';

  // Auth endpoints
  static const String auth = '/api/auth';
  static const String login = '/login';
  static const String register = '/register';
  static const String googleLogin = '/google';
  static const String refreshToken = '/refresh-token';
  static const String changePassword = '/change-password';
  static const String forgotPassword = '/forgot-password';
  static const String verifyOtp = '/verify-otp';
  static const String resetPassword = '/reset-password';
  static const String logout = '/logout';

  // User endpoints
  static const String users = '/api/users';
  static const String currentUser = '/me';
  static const String updateUserPicture = '/me/update-picture';
}
