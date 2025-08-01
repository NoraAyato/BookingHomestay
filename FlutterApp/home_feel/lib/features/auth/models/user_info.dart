class UserInfo {
  final String? id;
  final String? userName;
  final String? email;
  final String? picture;
  final String? phoneNumber;

  UserInfo({
    this.id,
    this.userName,
    this.email,
    this.picture,
    this.phoneNumber,
  });

  factory UserInfo.fromJson(Map<String, dynamic> json) {
    return UserInfo(
      id: json['id']?.toString(),
      userName: json['userName'],
      email: json['email'],
      picture: json['picture'],
      phoneNumber: json['phoneNumber'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userName': userName,
      'email': email,
      'picture': picture,
      'phoneNumber': phoneNumber,
    };
  }

  UserInfo copyWith({
    String? id,
    String? userName,
    String? email,
    String? picture,
    String? phoneNumber,
  }) {
    return UserInfo(
      id: id ?? this.id,
      userName: userName ?? this.userName,
      email: email ?? this.email,
      picture: picture ?? this.picture,
      phoneNumber: phoneNumber ?? this.phoneNumber,
    );
  }
}
