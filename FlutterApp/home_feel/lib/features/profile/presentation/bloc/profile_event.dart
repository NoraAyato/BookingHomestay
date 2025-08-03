abstract class ProfileEvent {}

class UploadAvatarEvent extends ProfileEvent {
  final String filePath;
  UploadAvatarEvent(this.filePath);
}

class UpdateProfileEvent extends ProfileEvent {
  final String userName;
  final String phoneNumber;
  final bool gender;
  final DateTime birthday;

  UpdateProfileEvent({
    required this.userName,
    required this.phoneNumber,
    required this.gender,
    required this.birthday,
  });
}
