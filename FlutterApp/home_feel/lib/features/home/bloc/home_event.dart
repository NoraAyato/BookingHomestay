

abstract class HomeEvent {}

class FetchHomestaysEvent extends HomeEvent {
  final String? location;
  final String? filterType;
  FetchHomestaysEvent({this.location, this.filterType});
}
