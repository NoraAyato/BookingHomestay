import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/core/constants/api.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_state.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_event.dart';
import 'package:home_feel/features/profile/presentation/screens/edit_profile_screen.dart';
import 'package:home_feel/shared/presentation/widgets/app_dialog.dart';

import 'package:image_picker/image_picker.dart';
import 'package:home_feel/features/profile/presentation/bloc/profile_bloc.dart';
import 'package:home_feel/features/profile/presentation/bloc/profile_event.dart';
import 'package:home_feel/features/profile/presentation/bloc/profile_state.dart';

class ProfileScreen extends StatefulWidget {
  final VoidCallback? onLogin;
  const ProfileScreen({super.key, this.onLogin});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  void initState() {
    super.initState();
    // Reset ProfileBloc state khi màn hình được mở
    context.read<ProfileBloc>().add(ResetProfileStateEvent());
  }

  @override
  Widget build(BuildContext context) {
    // Sử dụng ProfileBloc từ global context thay vì tạo mới
    return _ProfileScreenContent(onLogin: widget.onLogin);
  }
}

class _ProfileScreenContent extends StatelessWidget {
  final VoidCallback? onLogin;
  const _ProfileScreenContent({this.onLogin});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: BlocListener<ProfileBloc, ProfileState>(
        listener: (context, profileState) {
          if (profileState is ProfileAvatarUploading) {
            // Có thể thêm loading indicator ở đây
          } else if (profileState is ProfileAvatarUpdated) {
            context.read<AuthBloc>().add(CheckAuthStatusEvent());
            showAppDialog(
              context: context,
              title: 'Thành công',
              message: 'Cập nhật ảnh đại diện thành công!',
              type: AppDialogType.success,
              buttonText: 'Đóng',
              onButtonPressed: () => Navigator.of(context).pop(),
            );
          } else if (profileState is ProfileError) {
            showAppDialog(
              context: context,
              title: 'Lỗi',
              message: profileState.message,
              type: AppDialogType.error,
              buttonText: 'Đóng',
              onButtonPressed: () => Navigator.of(context).pop(),
            );
          }
        },
        child: BlocBuilder<AuthBloc, AuthState>(
          builder: (context, state) {
            final isLoggedIn =
                state is AuthSuccess && state.authResponse.data != null;
            final userInfo = isLoggedIn ? state.userInfo : null;

            return ListView(
              padding: EdgeInsets.zero,
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.only(
                    top: 40,
                    left: 24,
                    right: 24,
                    bottom: 24,
                  ),
                  decoration: const BoxDecoration(
                    color: Color(0xFFFFF3E0), // cam nhạt
                    borderRadius: BorderRadius.only(
                      bottomLeft: Radius.circular(24),
                      bottomRight: Radius.circular(24),
                    ),
                  ),
                  child: Row(
                    children: [
                      isLoggedIn
                          ? BlocBuilder<ProfileBloc, ProfileState>(
                              builder: (context, profileState) {
                                final isUploading =
                                    profileState is ProfileAvatarUploading;
                                return GestureDetector(
                                  onTap: isUploading
                                      ? null
                                      : () async {
                                          final picker = ImagePicker();
                                          final pickedFile = await picker
                                              .pickImage(
                                                source: ImageSource.gallery,
                                              );
                                          if (pickedFile != null) {
                                            context.read<ProfileBloc>().add(
                                              UploadAvatarEvent(
                                                pickedFile.path,
                                              ),
                                            );
                                          }
                                        },
                                  child: Stack(
                                    children: [
                                      CircleAvatar(
                                        radius: 32,
                                        backgroundColor: Colors.white,
                                        backgroundImage:
                                            (userInfo?.picture?.isNotEmpty ??
                                                false)
                                            ? NetworkImage(
                                                userInfo!.picture!.startsWith(
                                                      'http',
                                                    )
                                                    ? userInfo.picture!
                                                    : '${ApiConstants.baseUrl}${userInfo.picture!}',
                                              )
                                            : null,
                                        child:
                                            !(userInfo?.picture?.isNotEmpty ??
                                                false)
                                            ? const Icon(
                                                Icons.person,
                                                size: 48,
                                                color: Colors.grey,
                                              )
                                            : null,
                                      ),
                                      if (isUploading)
                                        Positioned.fill(
                                          child: Container(
                                            decoration: BoxDecoration(
                                              color: Colors.black.withOpacity(
                                                0.5,
                                              ),
                                              shape: BoxShape.circle,
                                            ),
                                            child: const Center(
                                              child: SizedBox(
                                                width: 20,
                                                height: 20,
                                                child:
                                                    CircularProgressIndicator(
                                                      color: Colors.white,
                                                      strokeWidth: 2,
                                                    ),
                                              ),
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                );
                              },
                            )
                          : CircleAvatar(
                              radius: 32,
                              backgroundColor: Colors.white,
                              child: const Icon(
                                Icons.person,
                                size: 48,
                                color: Colors.grey,
                              ),
                            ),

                      const SizedBox(width: 16),
                      Expanded(
                        child: isLoggedIn
                            ? Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    userInfo?.userName ?? 'Người dùng',
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    userInfo?.email ?? '',
                                    style: const TextStyle(
                                      color: Colors.black54,
                                    ),
                                  ),
                                ],
                              )
                            : GestureDetector(
                                onTap: onLogin,
                                child: const Text(
                                  'Đăng nhập/ Đăng ký',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                      ),
                      if (isLoggedIn)
                        IconButton(
                          icon: const Icon(Icons.edit, color: Colors.orange),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    EditProfileScreen(userInfo: userInfo!),
                              ),
                            );
                          },
                        ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Cài đặt
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24),
                  child: Text(
                    'Cài đặt',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 8),
                ListTile(
                  leading: const Icon(
                    Icons.notifications_none,
                    color: Color(0xFFFF9800),
                  ),
                  title: const Text('Thông báo'),
                  onTap: () {},
                ),
                ListTile(
                  leading: const Icon(Icons.language, color: Color(0xFFFF9800)),
                  title: const Text('Ngôn ngữ'),
                  trailing: const Text(
                    'Tiếng Việt',
                    style: TextStyle(color: Color(0xFFFF9800)),
                  ),
                  onTap: () {},
                ),
                ListTile(
                  leading: const Icon(
                    Icons.location_on_outlined,
                    color: Color(0xFFFF9800),
                  ),
                  title: const Text('Khu vực'),
                  trailing: const Text(
                    'Hồ Chí Minh',
                    style: TextStyle(color: Color(0xFFFF9800)),
                  ),
                  onTap: () {},
                ),
                const Divider(
                  height: 32,
                  thickness: 1,
                  indent: 24,
                  endIndent: 24,
                ),

                // Thông tin
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24),
                  child: Text(
                    'Thông tin',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 8),
                ListTile(
                  leading: const Icon(
                    Icons.help_outline,
                    color: Color(0xFFFF9800),
                  ),
                  title: const Text('Hỏi đáp'),
                  onTap: () {},
                ),
                ListTile(
                  leading: const Icon(
                    Icons.shield_outlined,
                    color: Color(0xFFFF9800),
                  ),
                  title: const Text('Điều khoản & Chính sách bảo mật'),
                  onTap: () {},
                ),
                ListTile(
                  leading: const Icon(
                    Icons.download_outlined,
                    color: Color(0xFFFF9800),
                  ),
                  title: const Text('Phiên bản'),
                  trailing: const Text(
                    '15.69.0',
                    style: TextStyle(color: Colors.grey),
                  ),
                ),
                ListTile(
                  leading: const Icon(
                    Icons.phone_outlined,
                    color: Color(0xFFFF9800),
                  ),
                  title: const Text('Liên hệ'),
                  onTap: () {},
                ),

                if (isLoggedIn)
                  ListTile(
                    leading: const Icon(Icons.logout, color: Colors.red),
                    title: const Text(
                      'Đăng xuất',
                      style: TextStyle(color: Colors.red),
                    ),
                    onTap: () {
                      context.read<AuthBloc>().add(LogoutEvent());
                    },
                  ),

                const SizedBox(height: 24),
              ],
            );
          },
        ),
      ),
    );
  }
}
