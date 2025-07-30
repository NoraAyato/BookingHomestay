import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:home_feel/features/auth/data/models/user_info.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/auth_response.dart';

class AuthService {
  static const String _accessTokenKey = 'access_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userInfoKey = 'user_info';
  static const String _isLoggedInKey = 'is_logged_in';
  
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();
  final SharedPreferences _prefs;

  AuthService(this._prefs);

  // Save auth data
  Future<void> saveAuthData(AuthData authData) async {
    await _secureStorage.write(key: _accessTokenKey, value: authData.accessToken);
    await _secureStorage.write(key: _refreshTokenKey, value: authData.refreshToken);
    await _prefs.setBool(_isLoggedInKey, true);
  }

  // Save user info
  Future<void> saveUserInfo(UserInfo userInfo) async {
    await _prefs.setString(_userInfoKey, userInfo.toString());
  }

  // Get access token
  Future<String?> getAccessToken() async {
    return await _secureStorage.read(key: _accessTokenKey);
  }

  // Get refresh token
  Future<String?> getRefreshToken() async {
    return await _secureStorage.read(key: _refreshTokenKey);
  }

  // Check if user is logged in
  bool isLoggedIn() {
    return _prefs.getBool(_isLoggedInKey) ?? false;
  }

  // Clear auth data
  Future<void> clearAuthData() async {
    await _secureStorage.delete(key: _accessTokenKey);
    await _secureStorage.delete(key: _refreshTokenKey);
    await _prefs.remove(_userInfoKey);
    await _prefs.setBool(_isLoggedInKey, false);
  }

  // Update access token
  Future<void> updateAccessToken(String newAccessToken) async {
    await _secureStorage.write(key: _accessTokenKey, value: newAccessToken);
  }

  // Get user info
  String? getUserInfo() {
    return _prefs.getString(_userInfoKey);
  }
} 