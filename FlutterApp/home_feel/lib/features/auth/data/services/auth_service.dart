import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:home_feel/features/auth/data/models/auth_data.dart';
import 'package:home_feel/features/auth/data/models/user_info.dart';
import 'package:shared_preferences/shared_preferences.dart';

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
    await _prefs.setString(_accessTokenKey, authData.accessToken);
    await _prefs.setString(_refreshTokenKey, authData.refreshToken);
    await _prefs.setBool(_isLoggedInKey, true);
  }

  // Save user info
  Future<void> saveUserInfo(UserInfo userInfo) async {
    final jsonString = jsonEncode(userInfo.toJson());
    await _prefs.setString(_userInfoKey, jsonString);
  }

  // Get access token
  Future<String?> getAccessToken() async {
    return _prefs.getString(_accessTokenKey);
  }

  // Get refresh token
  Future<String?> getRefreshToken() async {
    return _prefs.getString(_refreshTokenKey);
  }

  // Check if user is logged in
  bool isLoggedIn() {
    return _prefs.getBool(_isLoggedInKey) ?? false;
  }

  // Clear auth data
  Future<void> clearAuthData() async {
    await _prefs.remove(_accessTokenKey);
    await _prefs.remove(_refreshTokenKey);
    await _prefs.remove(_userInfoKey);
    await _prefs.setBool(_isLoggedInKey, false);
  }

  // Update access token
  Future<void> updateAccessToken(String newAccessToken) async {
    await _prefs.setString(_accessTokenKey, newAccessToken);
  }

  // Get user info
  UserInfo? getUserInfoObject() {
    final jsonString = _prefs.getString(_userInfoKey);
    if (jsonString == null) return null;

    final Map<String, dynamic> jsonMap = jsonDecode(jsonString);
    return UserInfo.fromJson(jsonMap);
  }
}
