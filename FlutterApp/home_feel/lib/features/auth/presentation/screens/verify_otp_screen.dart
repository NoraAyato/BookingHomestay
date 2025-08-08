import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:home_feel/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_event.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_state.dart';
import 'package:home_feel/shared/presentation/widgets/app_dialog.dart';

import 'reset_password_screen.dart';
import 'dart:async';

class VerifyOtpScreen extends StatefulWidget {
  final String email;
  const VerifyOtpScreen({super.key, required this.email});

  @override
  State<VerifyOtpScreen> createState() => _VerifyOtpScreenState();
}

class _VerifyOtpScreenState extends State<VerifyOtpScreen> {
  final TextEditingController _otpController = TextEditingController();
  bool _isFormValid = false;
  int _seconds = 60;
  late Timer _timer;
  bool _canResend = false;

  @override
  void initState() {
    super.initState();
    _otpController.addListener(_validateForm);
    _startTimer();
  }

  void _startTimer() {
    _seconds = 60;
    _canResend = false;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_seconds == 0) {
        setState(() {
          _canResend = true;
        });
        timer.cancel();
      } else {
        setState(() {
          _seconds--;
        });
      }
    });
  }

  void _validateForm() {
    final isValid = _otpController.text.trim().length == 6;
    if (isValid != _isFormValid) {
      setState(() {
        _isFormValid = isValid;
      });
    }
  }

  void _handleVerifyOtp() {
    final otp = _otpController.text.trim();
    context.read<AuthBloc>().add(VerifyOtpEvent(email: widget.email, otp: otp));
  }

  void _handleResendOtp() {
    context.read<AuthBloc>().add(ForgotPasswordEvent(email: widget.email));
    _otpController.clear();
    _startTimer();
  }

  @override
  void dispose() {
    _otpController.dispose();
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'Xác minh OTP',
          style: TextStyle(color: Colors.black),
        ),
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: BlocListener<AuthBloc, AuthState>(
        listener: (context, state) async {
          if (state is AuthSuccess &&
              state.authResponse.data != null &&
              (state.authResponse.data?.accessToken != null)) {
            final token = state.authResponse.data?.accessToken ?? '';
            await showAppDialog(
              context: context,
              title: 'Thành công',
              message: 'Xác minh OTP thành công. Vui lòng đặt lại mật khẩu.',
              type: AppDialogType.success,
              buttonText: 'Tiếp tục',
              onButtonPressed: () {
                Navigator.of(context).pop();
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ResetPasswordScreen(token: token),
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
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32),
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
                                Icons.verified_user,
                                size: 48,
                                color: Colors.deepOrange,
                              ),
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              'Xác minh OTP',
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                                color: Colors.deepOrange,
                              ),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'Nhập mã OTP gồm 6 số đã gửi về email của bạn',
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
                          controller: _otpController,
                          keyboardType: TextInputType.number,
                          maxLength: 6,
                          decoration: InputDecoration(
                            labelText: 'Mã OTP',
                            prefixIcon: const Icon(Icons.numbers),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        TextButton(
                          onPressed: _canResend ? _handleResendOtp : null,
                          child: Text(
                            _canResend
                                ? 'Gửi lại mã OTP'
                                : 'Gửi lại sau $_seconds giây',
                          ),
                        ),
                        const SizedBox(height: 24),
                        SizedBox(
                          height: 48,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: _isFormValid
                                  ? Colors.deepOrange
                                  : Colors.grey.shade400,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            onPressed: _isFormValid ? _handleVerifyOtp : null,
                            child: const Text(
                              'Xác minh',
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
        ),
      ),
    );
  }
}
