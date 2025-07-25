import 'package:home_feel/features/home/data/models/homestay_model.dart';

abstract class HomeState {}

class HomeInitial extends HomeState {}

class HomeLoading extends HomeState {}

class HomeLoaded extends HomeState {
  final List<HomestayModel> homestays;
  HomeLoaded(this.homestays);
}

class HomeError extends HomeState {
  final String message;
  HomeError(this.message);
}
