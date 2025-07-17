import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_event.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_state.dart';
import 'package:home_feel/features/auth/presentation/screens/register_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class LoginScreen extends StatelessWidget {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final FlutterSecureStorage storage =
      FlutterSecureStorage(); // Khởi tạo storage

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
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
                        'Login successful! Access Token: ${state.accessToken}',
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
                                LoginEvent(
                                  _emailController.text,
                                  _passwordController.text,
                                ),
                              );
                            },
                            child: Text('Login'),
                          ),
                          TextButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => RegisterScreen(),
                                ),
                              );
                            },
                            child: Text('Go to Register'),
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
