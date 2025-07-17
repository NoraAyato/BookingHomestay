import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:home_feel/core/network/dio_client.dart';
import 'package:home_feel/features/auth/data/datasources/auth_remote_datasource.dart';
import 'package:home_feel/features/auth/data/repositories/auth_repository_impl.dart';
import 'package:home_feel/features/auth/domain/repositories/auth_repository.dart';
import 'package:home_feel/features/auth/domain/usecases/login_user.dart';
import 'package:home_feel/features/auth/domain/usecases/register_user.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:home_feel/features/auth/presentation/bloc/auth_event.dart';
import 'package:home_feel/features/auth/presentation/screens/login_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final dioClient = DioClient();
  final authRemoteDataSource = AuthRemoteDataSource(dioClient.dioInstance);
  final authRepository = AuthRepositoryImpl(authRemoteDataSource);
  final loginUser = LoginUser(authRepository);
  final registerUser = RegisterUser(authRepository);
  final authBloc = AuthBloc(loginUser: loginUser, registerUser: registerUser);

  // Kiểm tra accessToken khi khởi động
  final storage = FlutterSecureStorage();
  final accessToken = await storage.read(key: 'access_token');
  if (accessToken != null) {
    authBloc.add(
      LoginEvent('', ''),
    ); // Tự động thử login (cần điều chỉnh logic)
  }

  runApp(MyApp(authBloc: authBloc));
}

class MyApp extends StatelessWidget {
  final AuthBloc authBloc;

  MyApp({required this.authBloc});

  @override
  Widget build(BuildContext context) {
    return BlocProvider<AuthBloc>.value(
      value: authBloc,
      child: MaterialApp(
        home: LoginScreen(), // Mặc định vào màn hình login
        theme: ThemeData(primarySwatch: Colors.blue),
      ),
    );
  }
}
