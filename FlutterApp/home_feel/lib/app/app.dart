import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:home_feel/features/home/bloc/home_bloc.dart';
import 'package:home_feel/features/home/bloc/location_bloc.dart';
import 'package:home_feel/features/home/presentation/screens/home_screen.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (context) => GetIt.I.get<HomeBloc>()),
        BlocProvider(create: (context) => GetIt.I.get<LocationBloc>()),
      ],
      child: MaterialApp(
        title: 'Home Feel',
        theme: ThemeData(primarySwatch: Colors.orange),
        home: const HomeScreen(),
      ),
    );
  }
}
