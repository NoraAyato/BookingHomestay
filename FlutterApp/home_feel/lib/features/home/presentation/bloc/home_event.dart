import 'package:equatable/equatable.dart';
import 'package:home_feel/features/home/data/models/available_room_model.dart';
import 'package:home_feel/features/home/data/models/room_images_model.dart';

abstract class HomeEvent extends Equatable {
  const HomeEvent();

  @override
  List<Object?> get props => [];
}

class GetRoomImagesEvent extends HomeEvent {
  final String maPhong;
  const GetRoomImagesEvent(this.maPhong);
  @override
  List<Object?> get props => [maPhong];
}

class GetRoomDetailEvent extends HomeEvent {
  final String maPhong;
  const GetRoomDetailEvent(this.maPhong);
  @override
  List<Object?> get props => [maPhong];
}

class FetchHomestaysEvent extends HomeEvent {
  final String? location;
  final String? filterType;
  final bool refresh;

  const FetchHomestaysEvent({
    this.location,
    this.filterType,
    this.refresh = false,
  });

  @override
  List<Object?> get props => [location, filterType, refresh];
}

class UpdateLocationEvent extends HomeEvent {
  final String location;

  const UpdateLocationEvent(this.location);

  @override
  List<Object?> get props => [location];
}

class UpdateFilterTypeEvent extends HomeEvent {
  final String filterType;

  const UpdateFilterTypeEvent(this.filterType);

  @override
  List<Object?> get props => [filterType];
}

class ClearFiltersEvent extends HomeEvent {
  const ClearFiltersEvent();
}

class RefreshHomestaysEvent extends HomeEvent {
  const RefreshHomestaysEvent();
}

class SuggestHomestaysEvent extends HomeEvent {
  final String prefix;
  const SuggestHomestaysEvent(this.prefix);

  @override
  List<Object?> get props => [prefix];
}

class SearchHomestaysEvent extends HomeEvent {
  final String keyword;
  const SearchHomestaysEvent(this.keyword);

  @override
  List<Object?> get props => [keyword];
}

class GetHomestayDetailEvent extends HomeEvent {
  final String id;
  const GetHomestayDetailEvent(this.id);
  @override
  List<Object?> get props => [id];
}

class GetHomestayImagesEvent extends HomeEvent {
  final String id;
  const GetHomestayImagesEvent(this.id);
  @override
  List<Object?> get props => [id];
}

class GetHomestayTienNghiEvent extends HomeEvent {
  final String id;
  const GetHomestayTienNghiEvent(this.id);
  @override
  List<Object?> get props => [id];
}

class GetAvailableRoomsEvent extends HomeEvent {
  final String homestayId;
  final DateTime checkIn;
  final DateTime checkOut;
  const GetAvailableRoomsEvent({
    required this.homestayId,
    required this.checkIn,
    required this.checkOut,
  });
  @override
  List<Object?> get props => [homestayId, checkIn, checkOut];
}
