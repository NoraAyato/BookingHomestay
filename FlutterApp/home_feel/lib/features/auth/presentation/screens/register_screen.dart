import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_event.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_state.dart';

class RegisterScreen extends StatelessWidget {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final FlutterSecureStorage storage =
      FlutterSecureStorage(); // Khởi tạo storage

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Register')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _emailController,
              decoration: InputDecoration(labelText: 'Email'),
              keyboardType: TextInputType.emailAddress,
            ),
            TextField(
              controller: _passwordController,
              decoration: InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            TextField(
              controller: _firstNameController,
              decoration: InputDecoration(labelText: 'First Name'),
            ),
            TextField(
              controller: _lastNameController,
              decoration: InputDecoration(labelText: 'Last Name'),
            ),
            BlocConsumer<AuthBloc, AuthState>(
              listener: (context, state) async {
                if (state is AuthSuccess) {
                  await storage.write(
                    key: 'access_token',
                    value: state.accessToken,
                  ); // Lưu token
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'Register successful! Access Token: ${state.accessToken}',
                      ),
                    ),
                  );
                } else if (state is AuthError) {
                  ScaffoldMessenger.of(
                    context,
                  ).showSnackBar(SnackBar(content: Text(state.message)));
                }
              },
              builder: (context, state) {
                return state is AuthLoading
                    ? CircularProgressIndicator()
                    : Column(
                        children: [
                          ElevatedButton(
                            onPressed: () {
                              final bloc = context.read<AuthBloc>();
                              bloc.add(
                                RegisterEvent(
                                  _emailController.text,
                                  _passwordController.text,
                                  _firstNameController.text,
                                  _lastNameController.text,
                                ),
                              );
                            },
                            child: Text('Register'),
                          ),
                          TextButton(
                            onPressed: () {
                              Navigator.pop(context); // Quay lại LoginScreen
                            },
                            child: Text('Back to Login'),
                          ),
                        ],
                      );
              },
            ),
          ],
        ),
      ),
    );
  }
}
