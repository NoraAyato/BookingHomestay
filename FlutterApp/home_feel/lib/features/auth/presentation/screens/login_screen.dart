import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/shared/presentation/widgets/app_dialog.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_event.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_state.dart';
import 'package:home_feel/features/profile/presentation/screens/profile_screen.dart';

import 'package:google_sign_in/google_sign_in.dart';
import 'forgot_password_screen.dart';

class LoginScreen extends StatefulWidget {
  final VoidCallback? onClose;
  final VoidCallback? onRegister;
  const LoginScreen({super.key, this.onClose, this.onRegister});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

final GoogleSignIn _googleSignIn = GoogleSignIn(
  scopes: ['email', 'profile'],
  serverClientId:
      '538549170516-t87c9ju6tpqeu4l3qijk22jpu2i6gd7c.apps.googleusercontent.com',
);

class _LoginScreenState extends State<LoginScreen> {
  bool rememberMe = false;
  bool _isFormValid = false;
  bool _showPassword = false;
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final RegExp _emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    _emailController.addListener(_validateForm);
    _passwordController.addListener(_validateForm);
  }

  void _validateForm() {
    final isValid =
        _emailRegex.hasMatch(_emailController.text.trim()) &&
        _passwordController.text.isNotEmpty;

    if (isValid != _isFormValid) {
      setState(() {
        _isFormValid = isValid;
      });
    }
  }

  void _handleLogin() {
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty || password.isEmpty) {
      showAppDialog(
        context: context,
        title: 'Lỗi',
        message: 'Vui lòng nhập đầy đủ thông tin.',
        type: AppDialogType.error,
        buttonText: 'Đóng',
      );
      return;
    }

    context.read<AuthBloc>().add(
      LoginEvent(email: email, password: password, rememberMe: rememberMe),
    );
  }

  Future<void> _handleGoogleLogin() async {
    try {
      final googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return; // Người dùng hủy đăng nhập

      final googleAuth = await googleUser.authentication;
      final idToken = googleAuth.idToken;
      if (idToken == null) throw Exception("Không lấy được idToken");

      final email = googleUser.email;
      final name = googleUser.displayName ?? '';
      final picture = googleUser.photoUrl;

      context.read<AuthBloc>().add(
        GoogleLoginEvent(
          idToken: idToken,
          email: email,
          name: name,
          picture: picture,
        ),
      );
    } catch (e) {
      showAppDialog(
        context: context,
        title: 'Lỗi',
        message: 'Đăng nhập bằng Google thất bại. Vui lòng thử lại.',
        type: AppDialogType.error,
        buttonText: 'Đóng',
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) {
        if (didPop) return;
        if (widget.onClose != null) {
          widget.onClose!();
        }
      },
      child: Scaffold(
        resizeToAvoidBottomInset: true,
        body: SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              return SingleChildScrollView(
                keyboardDismissBehavior:
                    ScrollViewKeyboardDismissBehavior.onDrag,
                padding: EdgeInsets.only(
                  left: 24,
                  right: 24,
                  top: 16,
                  bottom: MediaQuery.of(context).viewInsets.bottom,
                ),
                child: ConstrainedBox(
                  constraints: BoxConstraints(minHeight: constraints.maxHeight),
                  child: IntrinsicHeight(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Padding(
                            padding: const EdgeInsets.only(top: 8),
                            child: IconButton(
                              icon: const Icon(Icons.close),
                              onPressed: widget.onClose,
                              padding: EdgeInsets.only(left: -20),
                              constraints: const BoxConstraints(),
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Home Feel xin chào!',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Đăng nhập để đặt phòng với những ưu đãi độc quyền dành cho thành viên.',
                          style: TextStyle(fontSize: 15, color: Colors.black54),
                        ),
                        const SizedBox(height: 32),
                        TextField(
                          controller: _emailController,
                          decoration: InputDecoration(
                            labelText: 'Email',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            prefixIcon: const Icon(Icons.email_outlined),
                          ),
                          keyboardType: TextInputType.emailAddress,
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: _passwordController,
                          decoration: InputDecoration(
                            labelText: 'Mật khẩu',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            prefixIcon: const Icon(Icons.lock_outline),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _showPassword
                                    ? Icons.visibility
                                    : Icons.visibility_off,
                                color: Colors.grey,
                              ),
                              onPressed: () {
                                setState(() {
                                  _showPassword = !_showPassword;
                                });
                              },
                            ),
                          ),
                          obscureText: !_showPassword,
                        ),

                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Checkbox(
                              value: rememberMe,
                              onChanged: (value) {
                                setState(() {
                                  rememberMe = value ?? false;
                                });
                              },
                            ),
                            const Text('Ghi nhớ tôi'),
                            const Spacer(),
                            TextButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        const ForgotPasswordScreen(),
                                  ),
                                );
                              },
                              child: const Text('Quên mật khẩu'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        BlocConsumer<AuthBloc, AuthState>(
                          listener: (context, state) async {
                            if (state is AuthSuccess) {
                              await showAppDialog(
                                context: context,
                                title: 'Đăng nhập thành công',
                                message: state.authResponse.message,
                                type: AppDialogType.success,
                                buttonText: 'Đóng',
                                onButtonPressed: () {
                                  Navigator.of(context).pop();
                                  if (widget.onClose != null) {
                                    widget.onClose!();
                                  } else {
                                    Navigator.pushReplacement(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) =>
                                            const ProfileScreen(),
                                      ),
                                    );
                                  }
                                },
                                barrierDismissible: false,
                              );
                            } else if (state is AuthFailure) {
                              await showAppDialog(
                                context: context,
                                title: 'Lỗi',
                                message: state.message,
                                type: AppDialogType.error,
                                buttonText: 'Đóng',
                                onButtonPressed: () =>
                                    Navigator.of(context).pop(),
                                barrierDismissible: true,
                              );
                            }
                          },
                          builder: (context, state) {
                            final isDisabled =
                                !_isFormValid || state is AuthLoading;

                            return SizedBox(
                              width: double.infinity,
                              height: 48,
                              child: ElevatedButton(
                                onPressed: isDisabled ? null : _handleLogin,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: isDisabled
                                      ? Colors.grey
                                      : const Color(0xFFFF9800),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(24),
                                  ),
                                ),
                                child: state is AuthLoading
                                    ? const CircularProgressIndicator(
                                        color: Colors.white,
                                      )
                                    : const Text(
                                        'Đăng nhập',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                              ),
                            );
                          },
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: const [
                            Expanded(child: Divider()),
                            Padding(
                              padding: EdgeInsets.symmetric(horizontal: 8),
                              child: Text('Hoặc đăng nhập nhanh bằng'),
                            ),
                            Expanded(child: Divider()),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            BlocBuilder<AuthBloc, AuthState>(
                              builder: (context, state) {
                                return IconButton(
                                  icon: Image.asset(
                                    'assets/icons/google.png',
                                    width: 36,
                                    height: 36,
                                  ),
                                  onPressed: state is AuthLoading
                                      ? null
                                      : _handleGoogleLogin,
                                );
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text('Bạn chưa có tài khoản? '),
                            GestureDetector(
                              onTap: widget.onRegister,
                              child: const Text(
                                'Đăng ký ngay',
                                style: TextStyle(
                                  color: Color(0xFFFF9800),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
