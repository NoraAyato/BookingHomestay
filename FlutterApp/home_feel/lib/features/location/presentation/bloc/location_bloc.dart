import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:home_feel/core/models/api_response.dart';
import 'package:home_feel/features/common/bloc/loading_bloc.dart';
import '../../domain/usecases/fetch_locations_use_case.dart';
import '../../domain/usecases/fetch_provinces_use_case.dart';
import '../../domain/usecases/fetch_districts_by_province_use_case.dart';
import '../../domain/usecases/fetch_wards_by_district_use_case.dart';
import '../../domain/usecases/get_location_by_id_use_case.dart';
import 'location_event.dart';
import 'location_state.dart';

class LocationBloc extends Bloc<LocationEvent, LocationState> {
  final FetchLocationsUseCase fetchLocationsUseCase;
  final FetchProvincesUseCase fetchProvincesUseCase;
  final FetchDistrictsByProvinceUseCase fetchDistrictsByProvinceUseCase;
  final FetchWardsByDistrictUseCase fetchWardsByDistrictUseCase;
  final GetLocationByIdUseCase getLocationByIdUseCase;

  LocationBloc({
    required this.fetchLocationsUseCase,
    required this.fetchProvincesUseCase,
    required this.fetchDistrictsByProvinceUseCase,
    required this.fetchWardsByDistrictUseCase,
    required this.getLocationByIdUseCase,
  }) : super(LocationInitial()) {
    on<FetchAllLocationsEvent>(_onFetchAllLocations);
    on<FetchProvincesEvent>(_onFetchProvinces);
    on<FetchDistrictsEvent>(_onFetchDistricts);
    on<FetchWardsEvent>(_onFetchWards);
    on<GetLocationByIdEvent>(_onGetLocationById);
  }

  void _showLoading() => GetIt.I<LoadingBloc>().show();
  void _hideLoading() => GetIt.I<LoadingBloc>().hide();

  Future<void> _onFetchAllLocations(
    FetchAllLocationsEvent event,
    Emitter<LocationState> emit,
  ) async {
    emit(LocationLoading());
    _showLoading();
    try {
      final locations = await fetchLocationsUseCase();
      emit(LocationsLoaded(locations));
    } catch (e) {
      emit(
        LocationError(
          message: 'Có lỗi xảy ra khi tải danh sách địa điểm',
          errorDetails: e.toString(),
        ),
      );
    } finally {
      _hideLoading();
    }
  }

  Future<void> _onFetchProvinces(
    FetchProvincesEvent event,
    Emitter<LocationState> emit,
  ) async {
    emit(LocationLoading());
    _showLoading();
    try {
      final provinces = await fetchProvincesUseCase();
      emit(ProvincesLoaded(provinces));
    } catch (e) {
      emit(
        LocationError(
          message: 'Có lỗi xảy ra khi tải danh sách tỉnh/thành phố',
          errorDetails: e.toString(),
        ),
      );
    } finally {
      _hideLoading();
    }
  }

  Future<void> _onFetchDistricts(
    FetchDistrictsEvent event,
    Emitter<LocationState> emit,
  ) async {
    emit(LocationLoading());
    _showLoading();
    try {
      final districts = await fetchDistrictsByProvinceUseCase(event.provinceId);
      emit(DistrictsLoaded(districts, event.provinceId));
    } catch (e) {
      emit(
        LocationError(
          message: 'Có lỗi xảy ra khi tải danh sách quận/huyện',
          errorDetails: e.toString(),
        ),
      );
    } finally {
      _hideLoading();
    }
  }

  Future<void> _onFetchWards(
    FetchWardsEvent event,
    Emitter<LocationState> emit,
  ) async {
    emit(LocationLoading());
    _showLoading();
    try {
      final wards = await fetchWardsByDistrictUseCase(event.districtId);
      emit(WardsLoaded(wards, event.districtId));
    } catch (e) {
      emit(
        LocationError(
          message: 'Có lỗi xảy ra khi tải danh sách phường/xã',
          errorDetails: e.toString(),
        ),
      );
    } finally {
      _hideLoading();
    }
  }

  Future<void> _onGetLocationById(
    GetLocationByIdEvent event,
    Emitter<LocationState> emit,
  ) async {
    emit(LocationLoading());
    _showLoading();
    try {
      final location = await getLocationByIdUseCase(event.locationId);
      if (location != null) {
        emit(LocationDetailLoaded(location));
      } else {
        emit(const LocationError(message: 'Không tìm thấy thông tin địa điểm'));
      }
    } catch (e) {
      emit(
        LocationError(
          message: 'Có lỗi xảy ra khi tải thông tin địa điểm',
          errorDetails: e.toString(),
        ),
      );
    } finally {
      _hideLoading();
    }
  }

  @override
  void onTransition(Transition<LocationEvent, LocationState> transition) {
    super.onTransition(transition);
    print('Event: ${transition.event}');
    print('CurrentState: ${transition.currentState}');
    print('NextState: ${transition.nextState}');
  }
}
