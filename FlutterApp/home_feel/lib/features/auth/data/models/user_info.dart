class UserInfo {
  final String userId;
  final String userName;
  final String email;
  final String? firstName;
  final String? lastName;
  final String? phoneNumber;
  final String? picture;
  final String? role;

  UserInfo({
    required this.userId,
    required this.userName,
    required this.email,
    this.firstName,
    this.lastName,
    this.phoneNumber,
    this.picture,
    this.role,
  });

  factory UserInfo.fromJson(Map<String, dynamic> json) {
    return UserInfo(
      userId: json['userId'] ?? '',
      userName: json['userName'] ?? '',
      email: json['email'] ?? '',
      firstName: json['firstName'],
      lastName: json['lastName'],
      phoneNumber: json['phoneNumber'],
      picture: json['picture'],
      role: json['role'],
    );
  }
} 