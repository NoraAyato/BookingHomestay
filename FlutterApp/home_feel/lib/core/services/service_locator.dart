import 'package:get_it/get_it.dart';
import 'package:dio/dio.dart';
import 'package:home_feel/features/auth/data/services/auth_service.dart';
import 'package:home_feel/features/common/bloc/loading_bloc.dart';
import 'package:home_feel/features/profile/domain/usecases/update_profile_usecase.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../features/home/data/repositories/home_repository_impl.dart';
import '../../features/home/domain/usecases/fetch_homestays_use_case.dart';
import '../../features/home/bloc/home_bloc.dart';
import '../services/api_service.dart';
import 'package:home_feel/core/services/tab_notifier.dart';

// Promotion dependencies
import '../../features/promotion/data/datasources/promotion_remote_data_source.dart';
import '../../features/promotion/data/repositories/promotion_repository_impl.dart';
import '../../features/promotion/domain/usecases/get_admin_khuyen_mai_usecase.dart';
import '../../features/promotion/domain/usecases/get_khuyen_mai_by_id_usecase.dart';
import '../../features/promotion/presentation/bloc/promotion_bloc.dart';

// Auth dependencies
import '../../features/auth/data/datasources/auth_remote_data_source.dart';
import '../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../features/auth/domain/repositories/auth_repository.dart';
import '../../features/auth/domain/usecases/login_usecase.dart';
import '../../features/auth/domain/usecases/register_usecase.dart';
import '../../features/auth/domain/usecases/google_login_usecase.dart';
import '../../features/auth/domain/usecases/refresh_token_usecase.dart';
import '../../features/auth/domain/usecases/change_password_usecase.dart';
import '../../features/auth/domain/usecases/forgot_password_usecase.dart';
import '../../features/auth/domain/usecases/verify_otp_usecase.dart';
import '../../features/auth/domain/usecases/reset_password_usecase.dart';
import '../../features/auth/domain/usecases/get_current_user_usecase.dart';
import '../../features/auth/bloc/auth_bloc.dart';

// Profile dependencies
import 'package:home_feel/features/profile/presentation/bloc/profile_bloc.dart';
import 'package:home_feel/features/profile/domain/usecases/upload_avatar_usecase.dart';
import 'package:home_feel/features/profile/data/datasources/user_remote_data_source.dart';
import 'package:home_feel/features/profile/data/repositories/user_repository_impl.dart';
import 'package:home_feel/features/profile/domain/repositories/user_repository.dart';

// Location dependencies
import 'package:home_feel/features/location/data/datasources/location_remote_data_source.dart';
import 'package:home_feel/features/location/data/repositories/location_repository_impl.dart';
import 'package:home_feel/features/location/domain/usecases/fetch_locations_use_case.dart';
import 'package:home_feel/features/location/domain/usecases/fetch_provinces_use_case.dart';
import 'package:home_feel/features/location/domain/usecases/fetch_districts_by_province_use_case.dart';
import 'package:home_feel/features/location/domain/usecases/fetch_wards_by_district_use_case.dart';
import 'package:home_feel/features/location/domain/usecases/get_location_by_id_use_case.dart';
import 'package:home_feel/features/location/presentation/bloc/location_bloc.dart';

final GetIt sl = GetIt.instance;

Future<void> setupServiceLocator() async {
  // Đăng ký Dio
  sl.registerLazySingleton<Dio>(() => Dio());

  // Đăng ký Auth dependencies
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(sl<Dio>()),
  );
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(sl<AuthRemoteDataSource>()),
  );

  // Auth Use Cases
  sl.registerLazySingleton<LoginUseCase>(
    () => LoginUseCase(sl<AuthRepository>()),
  );
  sl.registerLazySingleton<RegisterUseCase>(
    () => RegisterUseCase(sl<AuthRepository>()),
  );
  sl.registerLazySingleton<GoogleLoginUseCase>(
    () => GoogleLoginUseCase(sl<AuthRepository>()),
  );
  sl.registerLazySingleton<RefreshTokenUseCase>(
    () => RefreshTokenUseCase(sl<AuthRepository>()),
  );
  sl.registerLazySingleton<ChangePasswordUseCase>(
    () => ChangePasswordUseCase(sl<AuthRepository>()),
  );
  sl.registerLazySingleton<ForgotPasswordUseCase>(
    () => ForgotPasswordUseCase(sl<AuthRepository>()),
  );
  sl.registerLazySingleton<VerifyOtpUseCase>(
    () => VerifyOtpUseCase(sl<AuthRepository>()),
  );
  sl.registerLazySingleton<ResetPasswordUseCase>(
    () => ResetPasswordUseCase(sl<AuthRepository>()),
  );
  sl.registerLazySingleton<GetCurrentUserUseCase>(
    () => GetCurrentUserUseCase(sl<AuthRepository>()),
  );
  // SharedPreferences
  final prefs = await SharedPreferences.getInstance();
  sl.registerLazySingleton<SharedPreferences>(() => prefs);
  // Đăng ký AuthService
  sl.registerLazySingleton<AuthService>(
    () => AuthService(sl<SharedPreferences>()),
  );
  // Đăng ký ApiService
  sl.registerLazySingleton<ApiService>(
    () => ApiService(sl<AuthService>(), sl<RefreshTokenUseCase>()),
  );
  // Auth BLoC
  sl.registerLazySingleton<AuthBloc>(
    () => AuthBloc(
      loginUseCase: sl<LoginUseCase>(),
      registerUseCase: sl<RegisterUseCase>(),
      googleLoginUseCase: sl<GoogleLoginUseCase>(),
      refreshTokenUseCase: sl<RefreshTokenUseCase>(),
      changePasswordUseCase: sl<ChangePasswordUseCase>(),
      forgotPasswordUseCase: sl<ForgotPasswordUseCase>(),
      verifyOtpUseCase: sl<VerifyOtpUseCase>(),
      resetPasswordUseCase: sl<ResetPasswordUseCase>(),
      getCurrentUserUseCase: sl<GetCurrentUserUseCase>(),
      authService: sl<AuthService>(),
    ),
  );

  // Đăng ký Home Repository và Use Case
  sl.registerLazySingleton<HomeRepositoryImpl>(
    () => HomeRepositoryImpl(sl<ApiService>()),
  );
  sl.registerLazySingleton<FetchHomestaysUseCase>(
    () => FetchHomestaysUseCase(sl<HomeRepositoryImpl>()),
  );

  // Đăng ký Location dependencies
  // Data source
  sl.registerLazySingleton<LocationRemoteDataSource>(
    () => LocationRemoteDataSourceImpl(sl<ApiService>()),
  );

  // Repository implementation
  sl.registerLazySingleton<LocationRepositoryImpl>(
    () => LocationRepositoryImpl(sl<LocationRemoteDataSource>()),
  );

  // Use cases
  sl.registerLazySingleton<FetchLocationsUseCase>(
    () => FetchLocationsUseCase(sl<LocationRepositoryImpl>()),
  );
  sl.registerLazySingleton<FetchProvincesUseCase>(
    () => FetchProvincesUseCase(sl<LocationRepositoryImpl>()),
  );
  sl.registerLazySingleton<FetchDistrictsByProvinceUseCase>(
    () => FetchDistrictsByProvinceUseCase(sl<LocationRepositoryImpl>()),
  );
  sl.registerLazySingleton<FetchWardsByDistrictUseCase>(
    () => FetchWardsByDistrictUseCase(sl<LocationRepositoryImpl>()),
  );
  sl.registerLazySingleton<GetLocationByIdUseCase>(
    () => GetLocationByIdUseCase(sl<LocationRepositoryImpl>()),
  );

  // Đăng ký TabNotifier
  sl.registerLazySingleton<TabNotifier>(() => TabNotifier());
  sl.registerLazySingleton<LoadingBloc>(() => LoadingBloc());

  // Đăng ký BLoC
  sl.registerLazySingleton(() => HomeBloc(sl<FetchHomestaysUseCase>()));
  sl.registerFactory<LocationBloc>(
    () => LocationBloc(
      fetchLocationsUseCase: sl<FetchLocationsUseCase>(),
      fetchProvincesUseCase: sl<FetchProvincesUseCase>(),
      fetchDistrictsByProvinceUseCase: sl<FetchDistrictsByProvinceUseCase>(),
      fetchWardsByDistrictUseCase: sl<FetchWardsByDistrictUseCase>(),
      getLocationByIdUseCase: sl<GetLocationByIdUseCase>(),
    ),
  );

  // Đăng ký Profile dependencies
  sl.registerLazySingleton<UserRemoteDataSource>(
    () => UserRemoteDataSource(sl<ApiService>()),
  );
  sl.registerLazySingleton<UserRepository>(
    () => UserRepositoryImpl(sl<UserRemoteDataSource>()),
  );
  sl.registerLazySingleton<UploadAvatarUseCase>(
    () => UploadAvatarUseCase(sl<UserRepository>()),
  );
  sl.registerLazySingleton<UpdateProfileUseCase>(
    () => UpdateProfileUseCase(sl<UserRepository>()),
  );
  sl.registerLazySingleton<ProfileBloc>(
    () => ProfileBloc(sl<UploadAvatarUseCase>(), sl<UpdateProfileUseCase>()),
  );

  // Đăng ký Promotion dependencies
  sl.registerLazySingleton<PromotionRemoteDataSource>(
    () => PromotionRemoteDataSourceImpl(sl<ApiService>()),
  );
  sl.registerLazySingleton<PromotionRepositoryImpl>(
    () => PromotionRepositoryImpl(sl<PromotionRemoteDataSource>()),
  );
  sl.registerLazySingleton<GetAdminKhuyenMaiUseCase>(
    () => GetAdminKhuyenMaiUseCase(sl<PromotionRepositoryImpl>()),
  );
  sl.registerLazySingleton<GetKhuyenMaiByIdUseCase>(
    () => GetKhuyenMaiByIdUseCase(sl<PromotionRepositoryImpl>()),
  );
  sl.registerFactory<PromotionBloc>(
    () => PromotionBloc(
      getAdminKhuyenMaiUseCase: sl<GetAdminKhuyenMaiUseCase>(),
      getKhuyenMaiByIdUseCase: sl<GetKhuyenMaiByIdUseCase>(),
    ),
  );
}
