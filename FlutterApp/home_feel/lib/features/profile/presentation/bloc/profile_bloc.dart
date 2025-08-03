import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/core/models/api_response.dart';
import 'package:home_feel/features/profile/domain/usecases/update_profile_usecase.dart';
import '../../domain/usecases/upload_avatar_usecase.dart';
import 'profile_event.dart';
import 'profile_state.dart';

class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  final UploadAvatarUseCase uploadAvatarUseCase;
  final UpdateProfileUseCase updateProfileUseCase;

  ProfileBloc(this.uploadAvatarUseCase, this.updateProfileUseCase)
    : super(ProfileInitial()) {
    on<UploadAvatarEvent>(_onUploadAvatar);
    on<UpdateProfileEvent>(_onUpdateProfile);
  }

  Future<void> _onUploadAvatar(
    UploadAvatarEvent event,
    Emitter<ProfileState> emit,
  ) async {
    emit(ProfileLoading());
    try {
      final ApiResponse response = await uploadAvatarUseCase(
        event.token,
        event.filePath,
      );

      if (response.success) {
        emit(
          ProfileAvatarUpdated(message: response.message, data: response.data),
        );
      } else {
        // Trong trường hợp không thành công, message sẽ chứa thông tin lỗi
        emit(
          ProfileError(
            message: response.message,
            errorDetails: response.data?.toString(),
          ),
        );
      }
    } catch (e) {
      emit(
        ProfileError(
          message: 'Có lỗi xảy ra khi cập nhật ảnh đại diện',
          errorDetails: e.toString(),
        ),
      );
    }
  }
  Future<void> _onUpdateProfile(
  UpdateProfileEvent event,
  Emitter<ProfileState> emit,
) async {
  emit(ProfileLoading());
  try {
    final ApiResponse response = await updateProfileUseCase.call(
      token: event.token,
      userName: event.userName,
      phoneNumber: event.phoneNumber,
      gender: event.gender,
      birthday: event.birthday,
    );

    if (response.success) {
      emit(ProfileUpdated(message: response.message));
    } else {
      emit(ProfileError(message: response.message));
    }
  } catch (e) {
    emit(
      ProfileError(
        message: 'Có lỗi xảy ra khi cập nhật thông tin người dùng',
        errorDetails: e.toString(),
      ),
    );
  }
}

}
