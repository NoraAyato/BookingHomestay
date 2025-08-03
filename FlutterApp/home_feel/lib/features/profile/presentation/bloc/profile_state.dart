abstract class ProfileState {
  const ProfileState();
}

class ProfileInitial extends ProfileState {
  const ProfileInitial();
}

class ProfileLoading extends ProfileState {
  const ProfileLoading();
}

class ProfileAvatarUpdated extends ProfileState {
  final String message;
  final dynamic data;

  const ProfileAvatarUpdated({required this.message, this.data});
}

class ProfileUpdated extends ProfileState {
  final String message;

  const ProfileUpdated({required this.message});
}

class ProfileError extends ProfileState {
  final String message;
  final String? errorDetails;

  const ProfileError({required this.message, this.errorDetails});
}
