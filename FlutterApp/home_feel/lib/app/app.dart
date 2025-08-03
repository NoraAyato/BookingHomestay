import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:home_feel/features/auth/bloc/auth_bloc.dart';
import 'package:home_feel/features/auth/bloc/auth_event.dart';
import 'package:home_feel/features/news/presentation/bloc/news_bloc.dart';
import 'package:home_feel/features/news/presentation/bloc/news_event.dart';

import 'package:home_feel/features/home/presentation/bloc/home_bloc.dart';
import 'package:home_feel/features/home/presentation/screens/home_screen.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        // AuthBloc phải được khởi tạo trước để check auth status
        BlocProvider<AuthBloc>(
          create: (_) => GetIt.I<AuthBloc>()..add(CheckAuthStatusEvent()),
        ),
        // Các bloc khác khởi tạo sau khi đã có auth status
        BlocProvider(
          create: (context) => GetIt.I.get<HomeBloc>(),
          lazy: true, // Chỉ tạo khi cần
        ),
        BlocProvider(
          create: (context) => GetIt.I.get<NewsBloc>()..add(GetAllNewsEvent()),
          lazy: false,
        ),
      ],
      child: MaterialApp(
        title: 'Home Feel',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(primarySwatch: Colors.orange),

        // 🔻 BỔ SUNG CHO LOCALIZATION
        localizationsDelegates: const [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        supportedLocales: const [Locale('vi', 'VN'), Locale('en', 'US')],

        home: const HomeScreen(),
      ),
    );
  }
}
