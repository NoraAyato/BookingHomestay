// lib/main.dart
import 'package:flutter/material.dart';
import 'app/app.dart';
import 'core/services/service_locator.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await setupServiceLocator();
  runApp(const MyApp());
}
