class GoogleAuthRequest {
  final String idToken;
  final String email;
  final String name;
  final String? picture;

  GoogleAuthRequest({
    required this.idToken,
    required this.email,
    required this.name,
    this.picture,
  });

  Map<String, dynamic> toJson() {
    return {
      'idToken': idToken,
      'email': email,
      'name': name,
      'picture': picture,
    };
  }
} 