import 'package:home_feel/features/home/domain/usecases/get_room_images_use_case.dart';
import 'package:home_feel/features/home/domain/usecases/get_available_rooms_use_case.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/features/home/domain/usecases/fetch_homestays_use_case.dart';
import 'package:home_feel/features/home/domain/usecases/get_suggested_homestays.dart';
import 'package:home_feel/features/home/domain/usecases/search_homestay_by_keyword.dart';
import 'package:home_feel/features/home/domain/usecases/get_homestay_detail.dart';
import 'package:home_feel/features/home/domain/usecases/get_homestay_images.dart';
import 'package:home_feel/features/home/domain/usecases/get_homestay_tiennghi.dart';
// import 'package:home_feel/features/home/data/models/homestay_detail_model.dart';
import 'home_event.dart';
import 'home_state.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  final GetRoomImagesUseCase getRoomImagesUseCase;
  final GetAvailableRoomsUseCase getAvailableRoomsUseCase;
  final FetchHomestaysUseCase fetchHomestaysUseCase;
  final GetSuggestedHomestays getSuggestedHomestays;
  final SearchHomestayByKeyword searchHomestayByKeyword;
  final GetHomestayDetail getHomestayDetail;
  final GetHomestayImages getHomestayImages;
  final GetHomestayTienNghi getHomestayTienNghi;
  String? _currentLocation;
  String? _currentFilterType;

  HomeBloc(
    this.fetchHomestaysUseCase,
    this.getSuggestedHomestays,
    this.searchHomestayByKeyword,
    this.getHomestayDetail,
    this.getHomestayImages,
    this.getHomestayTienNghi,
    this.getAvailableRoomsUseCase,
    this.getRoomImagesUseCase,
  ) : super(const HomeInitial()) {
    on<FetchHomestaysEvent>(_onFetchHomestays);
    on<UpdateLocationEvent>(_onUpdateLocation);
    on<UpdateFilterTypeEvent>(_onUpdateFilterType);
    on<ClearFiltersEvent>(_onClearFilters);
    on<RefreshHomestaysEvent>(_onRefreshHomestays);
    on<SuggestHomestaysEvent>(_onSuggestHomestays);
    on<SearchHomestaysEvent>(_onSearchHomestays);
    on<GetHomestayDetailEvent>(_onGetHomestayDetail);
    on<GetHomestayImagesEvent>(_onGetHomestayImages);
    on<GetHomestayTienNghiEvent>(_onGetHomestayTienNghi);
    on<GetAvailableRoomsEvent>(_onGetAvailableRooms);
    on<GetRoomImagesEvent>(_onGetRoomImages);
  }

  Future<void> _onGetRoomImages(
    GetRoomImagesEvent event,
    Emitter<HomeState> emit,
  ) async {
    emit(const HomeRoomImagesLoading());
    try {
      final result = await getRoomImagesUseCase(event.maPhong);
      if (result.success && result.data != null) {
        emit(HomeRoomImagesLoaded(images: result.data!));
      } else {
        emit(HomeRoomImagesError(result.message));
      }
    } catch (e) {
      emit(HomeRoomImagesError(e.toString()));
    }
  }

  Future<void> _onGetAvailableRooms(
    GetAvailableRoomsEvent event,
    Emitter<HomeState> emit,
  ) async {
    emit(const HomeAvailableRoomsLoading());
    try {
      final result = await getAvailableRoomsUseCase(
        homestayId: event.homestayId,
        checkIn: event.checkIn,
        checkOut: event.checkOut,
      );
      if (result.success && result.data != null) {
        emit(HomeAvailableRoomsLoaded(rooms: result.data!));
      } else {
        emit(HomeAvailableRoomsError(result.message));
      }
    } catch (e) {
      emit(HomeAvailableRoomsError(e.toString()));
    }
  }

  void _onFetchHomestays(
    FetchHomestaysEvent event,
    Emitter<HomeState> emit,
  ) async {
    if (!event.refresh && state is HomeLoaded && !_hasFilterChanged(event)) {
      return; // Tránh gọi API không cần thiết nếu bộ lọc không thay đổi
    }

    emit(const HomeLoading());
    try {
      final result = await fetchHomestaysUseCase(
        location: event.location ?? _currentLocation,
        filterType: event.filterType ?? _currentFilterType,
      );

      if (result.success && result.data != null) {
        _currentLocation = event.location;
        _currentFilterType = event.filterType;
        emit(
          HomeLoaded(
            homestays: result.data!,
            selectedLocation: _currentLocation,
            selectedFilterType: _currentFilterType,
          ),
        );
      } else {
        emit(HomeError(result.message));
      }
    } catch (e) {
      if (e.toString().contains("SocketException")) {
        emit(
          const HomeError(
            "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.",
          ),
        );
      } else {
        emit(HomeError(e.toString()));
      }
    }
  }

  void _onUpdateLocation(
    UpdateLocationEvent event,
    Emitter<HomeState> emit,
  ) async {
    _currentLocation = event.location;
    add(
      FetchHomestaysEvent(
        location: _currentLocation,
        filterType: _currentFilterType,
      ),
    );
  }

  void _onUpdateFilterType(
    UpdateFilterTypeEvent event,
    Emitter<HomeState> emit,
  ) async {
    _currentFilterType = event.filterType;
    add(
      FetchHomestaysEvent(
        location: _currentLocation,
        filterType: _currentFilterType,
      ),
    );
  }

  void _onClearFilters(ClearFiltersEvent event, Emitter<HomeState> emit) {
    _currentLocation = null;
    _currentFilterType = null;
    add(const FetchHomestaysEvent());
  }

  void _onRefreshHomestays(
    RefreshHomestaysEvent event,
    Emitter<HomeState> emit,
  ) {
    add(
      FetchHomestaysEvent(
        location: _currentLocation,
        filterType: _currentFilterType,
        refresh: true,
      ),
    );
  }

  Future<void> _onSuggestHomestays(
    SuggestHomestaysEvent event,
    Emitter<HomeState> emit,
  ) async {
    emit(const HomeLoading());
    try {
      final suggestions = await getSuggestedHomestays(event.prefix);
      emit(HomeSuggestLoaded(suggestions: suggestions));
    } catch (e) {
      emit(HomeError(e.toString()));
    }
  }

  Future<void> _onSearchHomestays(
    SearchHomestaysEvent event,
    Emitter<HomeState> emit,
  ) async {
    emit(const HomeLoading());
    try {
      final results = await searchHomestayByKeyword(event.keyword);
      emit(HomeSearchLoaded(results: results));
    } catch (e) {
      emit(HomeError(e.toString()));
    }
  }

  Future<void> _onGetHomestayDetail(
    GetHomestayDetailEvent event,
    Emitter<HomeState> emit,
  ) async {
    emit(const HomeDetailLoading());
    try {
      final result = await getHomestayDetail(event.id);
      if (result.success && result.data != null) {
        emit(HomeDetailLoaded(detail: result.data!));
      } else {
        emit(HomeDetailError(result.message));
      }
    } catch (e) {
      emit(HomeDetailError(e.toString()));
    }
  }

  Future<void> _onGetHomestayImages(
    GetHomestayImagesEvent event,
    Emitter<HomeState> emit,
  ) async {
    emit(const HomeImagesLoading());
    try {
      final result = await getHomestayImages(event.id);
      if (result.success && result.data != null) {
        emit(HomeImagesLoaded(images: result.data!));
      } else {
        emit(HomeImagesError(result.message));
      }
    } catch (e) {
      emit(HomeImagesError(e.toString()));
    }
  }

  Future<void> _onGetHomestayTienNghi(
    GetHomestayTienNghiEvent event,
    Emitter<HomeState> emit,
  ) async {
    emit(const HomeTienNghiLoading());
    try {
      final result = await getHomestayTienNghi(event.id);
      if (result.success && result.data != null) {
        emit(HomeTienNghiLoaded(tiennghi: result.data!));
      } else {
        emit(HomeTienNghiError(result.message));
      }
    } catch (e) {
      emit(HomeTienNghiError(e.toString()));
    }
  }

  bool _hasFilterChanged(FetchHomestaysEvent event) {
    return event.location != _currentLocation ||
        event.filterType != _currentFilterType;
  }
}
