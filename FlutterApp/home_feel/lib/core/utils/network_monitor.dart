import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';

class NetworkMonitor {
  final Connectivity _connectivity = Connectivity();
  late StreamSubscription _subscription;

  Future<void> startMonitoring(
    Function(bool isConnected) onStatusChange,
  ) async {
    // Kiểm tra kết nối ban đầu ngay khi bắt đầu theo dõi
    var initialResult = await _connectivity.checkConnectivity();
    print('Initial connectivity result: $initialResult');
    final initialIsConnected = initialResult != ConnectivityResult.none;
    onStatusChange(initialIsConnected);

    // Lắng nghe các thay đổi kết nối
    _subscription = _connectivity.onConnectivityChanged.listen((
      dynamic result,
    ) {
      print('Connectivity changed: $result');
      if (result is ConnectivityResult) {
        final isConnected = result != ConnectivityResult.none;
        print('Is connected: $isConnected');
        onStatusChange(isConnected);
      }
    });
  }

  void stopMonitoring() {
    _subscription.cancel();
  }

  Future<bool> checkInternetConnection() async {
    var connectivityResult = await _connectivity.checkConnectivity();
    print('Manual connectivity check: $connectivityResult');
    return connectivityResult != ConnectivityResult.none;
  }
}
