import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/shared/presentation/widgets/app_dialog.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_event.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_state.dart';

import 'verify_otp_screen.dart';

class ForgotPasswordScreen extends StatefulWidget {
  final VoidCallback? onClose;
  const ForgotPasswordScreen({super.key, this.onClose});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final TextEditingController _emailController = TextEditingController();
  final RegExp _emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
  bool _isFormValid = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  void _validateForm() {
    final isValid = _emailRegex.hasMatch(_emailController.text.trim());
    if (isValid != _isFormValid) {
      setState(() {
        _isFormValid = isValid;
      });
    }
  }

  void _handleForgotPassword() {
    final email = _emailController.text.trim();
    if (email.isEmpty) {
      showAppDialog(
        context: context,
        title: 'Lỗi',
        message: 'Vui lòng nhập email của bạn.',
        type: AppDialogType.error,
        buttonText: 'Đóng',
      );
      return;
    }
    context.read<AuthBloc>().add(ForgotPasswordEvent(email: email));
  }

  @override
  void initState() {
    super.initState();
    _emailController.addListener(_validateForm);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'Quên mật khẩu',
          style: TextStyle(color: Colors.black),
        ),
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.black),
        leading: widget.onClose != null
            ? IconButton(
                icon: const Icon(Icons.close),
                onPressed: widget.onClose,
              )
            : null,
      ),
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) async {
          if (state is AuthLoading) {
            // Show loading overlay nếu đã tích hợp ở màn hình cha
          } else if (state is AuthSuccess) {
            await showAppDialog(
              context: context,
              title: 'Thành công',
              message:
                  'Đã gửi mã OTP về email. Vui lòng kiểm tra email để xác minh.',
              type: AppDialogType.success,
              buttonText: 'Tiếp tục',
              onButtonPressed: () {
                Navigator.of(context).pop();
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                        VerifyOtpScreen(email: _emailController.text.trim()),
                  ),
                );
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
              onButtonPressed: () => Navigator.of(context).pop(),
              barrierDismissible: true,
            );
          }
        },
        builder: (context, state) {
          return SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 24.0,
                vertical: 32,
              ),
              child: Column(
                children: [
                  Card(
                    elevation: 6,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24.0,
                        vertical: 32,
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Column(
                            children: [
                              Container(
                                decoration: BoxDecoration(
                                  color: Colors.orange.shade100,
                                  shape: BoxShape.circle,
                                ),
                                padding: const EdgeInsets.all(18),
                                child: const Icon(
                                  Icons.lock_reset_rounded,
                                  size: 48,
                                  color: Colors.deepOrange,
                                ),
                              ),
                              const SizedBox(height: 16),
                              const Text(
                                'Quên mật khẩu?',
                                style: TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.deepOrange,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.black87,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                          const SizedBox(height: 32),
                          TextField(
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                            decoration: InputDecoration(
                              labelText: 'Email',
                              prefixIcon: const Icon(Icons.email_outlined),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                          ),
                          const SizedBox(height: 32),
                          SizedBox(
                            height: 48,
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _isFormValid
                                    ? Colors.deepOrange
                                    : const Color(0xFFFF9800),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              onPressed: _isFormValid
                                  ? () {
                                      _handleForgotPassword();
                                    }
                                  : null,
                              child: const Text(
                                'Gửi email',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 60),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
