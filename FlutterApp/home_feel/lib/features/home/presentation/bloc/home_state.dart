import 'package:home_feel/features/home/data/models/room_images_model.dart';
import 'package:equatable/equatable.dart';
import 'package:home_feel/features/home/data/models/available_room_model.dart';
import 'package:home_feel/features/home/data/models/homestay_model.dart';
import 'package:home_feel/features/home/data/models/homestay_search_model.dart';
import 'package:home_feel/features/home/data/models/homestay_suggest_model.dart';
import 'package:home_feel/features/home/data/models/homestay_detail_model.dart';
import 'package:home_feel/features/home/data/models/homestay_image_response_model.dart';
import 'package:home_feel/features/home/data/models/homestay_tiennghi_response_model.dart';

class HomeRoomImagesLoading extends HomeState {
  const HomeRoomImagesLoading();
}

class HomeRoomImagesLoaded extends HomeState {
  final RoomImagesModel images;
  const HomeRoomImagesLoaded({required this.images});
  @override
  List<Object?> get props => [images];
}

class HomeRoomImagesError extends HomeState {
  final String message;
  const HomeRoomImagesError(this.message);
  @override
  List<Object?> get props => [message];
}

class HomeAvailableRoomsLoading extends HomeState {
  const HomeAvailableRoomsLoading();
}

class HomeAvailableRoomsLoaded extends HomeState {
  final List<AvailableRoomModel> rooms;
  const HomeAvailableRoomsLoaded({required this.rooms});
  @override
  List<Object?> get props => [rooms];
}

class HomeAvailableRoomsError extends HomeState {
  final String message;
  const HomeAvailableRoomsError(this.message);
  @override
  List<Object?> get props => [message];
}

abstract class HomeState extends Equatable {
  const HomeState();

  @override
  List<Object?> get props => [];
}

class HomeInitial extends HomeState {
  const HomeInitial();
}

class HomeLoading extends HomeState {
  const HomeLoading();
}

class HomeLoaded extends HomeState {
  final List<HomestayModel> homestays;
  final String? selectedLocation;
  final String? selectedFilterType;

  const HomeLoaded({
    required this.homestays,
    this.selectedLocation,
    this.selectedFilterType,
  });

  @override
  List<Object?> get props => [homestays, selectedLocation, selectedFilterType];

  HomeLoaded copyWith({
    List<HomestayModel>? homestays,
    String? selectedLocation,
    String? selectedFilterType,
  }) {
    return HomeLoaded(
      homestays: homestays ?? this.homestays,
      selectedLocation: selectedLocation ?? this.selectedLocation,
      selectedFilterType: selectedFilterType ?? this.selectedFilterType,
    );
  }
}

class HomeError extends HomeState {
  final String message;

  const HomeError(this.message);

  @override
  List<Object?> get props => [message];
}

class HomeSuggestLoaded extends HomeState {
  final List<HomestaySuggestModel> suggestions;
  const HomeSuggestLoaded({required this.suggestions});

  @override
  List<Object?> get props => [suggestions];
}

class HomeSearchLoaded extends HomeState {
  final List<HomestaySearchModel> results;
  const HomeSearchLoaded({required this.results});

  @override
  List<Object?> get props => [results];
}

class HomeDetailLoading extends HomeState {
  const HomeDetailLoading();
}

class HomeDetailLoaded extends HomeState {
  final HomestayDetailModel detail;
  const HomeDetailLoaded({required this.detail});
  @override
  List<Object?> get props => [detail];
}

class HomeDetailError extends HomeState {
  final String message;
  const HomeDetailError(this.message);
  @override
  List<Object?> get props => [message];
}

class HomeImagesLoading extends HomeState {
  const HomeImagesLoading();
}

class HomeImagesLoaded extends HomeState {
  final HomestayImageResponseModel images;
  const HomeImagesLoaded({required this.images});
  @override
  List<Object?> get props => [images];
}

class HomeImagesError extends HomeState {
  final String message;
  const HomeImagesError(this.message);
  @override
  List<Object?> get props => [message];
}

class HomeTienNghiLoading extends HomeState {
  const HomeTienNghiLoading();
}

class HomeTienNghiLoaded extends HomeState {
  final HomestayTienNghiResponseModel tiennghi;
  const HomeTienNghiLoaded({required this.tiennghi});
  @override
  List<Object?> get props => [tiennghi];
}

class HomeTienNghiError extends HomeState {
  final String message;
  const HomeTienNghiError(this.message);
  @override
  List<Object?> get props => [message];
}
