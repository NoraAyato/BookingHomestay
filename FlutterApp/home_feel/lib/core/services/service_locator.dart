import 'package:get_it/get_it.dart';
import '../../features/home/data/repositories/home_repository_impl.dart';
import '../../features/home/data/repositories/location_repository_impl.dart';
import '../../features/home/domain/usecases/fetch_homestays_use_case.dart';
import '../../features/home/domain/usecases/fetch_locations_use_case.dart';
import '../../features/home/bloc/home_bloc.dart';
import '../../features/home/bloc/location_bloc.dart';
import '../services/api_service.dart'; // Giả sử bạn có file này

final GetIt sl = GetIt.instance;

void setupServiceLocator() {
  // Đăng ký ApiService (giả sử đã có)
  sl.registerLazySingleton<ApiService>(() => ApiService());

  // Đăng ký Home Repository và Use Case
  sl.registerLazySingleton<HomeRepositoryImpl>(
    () => HomeRepositoryImpl(sl<ApiService>()),
  );
  sl.registerLazySingleton<FetchHomestaysUseCase>(
    () => FetchHomestaysUseCase(sl<HomeRepositoryImpl>()),
  );

  // Đăng ký Location Repository và Use Case
  sl.registerLazySingleton<LocationRepositoryImpl>(
    () => LocationRepositoryImpl(sl<ApiService>()),
  );
  sl.registerLazySingleton<FetchLocationsUseCase>(
    () => FetchLocationsUseCase(sl<LocationRepositoryImpl>()),
  );

  // Đăng ký BLoC (sử dụng LazySingleton để duy trì một instance)
  sl.registerLazySingleton(() => HomeBloc(sl<FetchHomestaysUseCase>()));
  sl.registerLazySingleton(() => LocationBloc(sl<FetchLocationsUseCase>()));
}
