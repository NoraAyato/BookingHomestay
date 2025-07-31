// lib/main.dart
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:home_feel/features/home/bloc/home_bloc.dart';
import 'package:home_feel/features/home/bloc/location_bloc.dart';
import 'app/app.dart';
import 'core/services/service_locator.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await setupServiceLocator();
  runApp(const MyApp());
}
