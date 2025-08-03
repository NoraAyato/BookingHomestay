import 'package:equatable/equatable.dart';

abstract class LocationEvent extends Equatable {
  const LocationEvent();

  @override
  List<Object> get props => [];
}

class FetchAllLocationsEvent extends LocationEvent {}

class FetchProvincesEvent extends LocationEvent {}

class FetchDistrictsEvent extends LocationEvent {
  final int provinceId;

  const FetchDistrictsEvent(this.provinceId);

  @override
  List<Object> get props => [provinceId];
}

class FetchWardsEvent extends LocationEvent {
  final int districtId;

  const FetchWardsEvent(this.districtId);

  @override
  List<Object> get props => [districtId];
}

class GetLocationByIdEvent extends LocationEvent {
  final int locationId;

  const GetLocationByIdEvent(this.locationId);

  @override
  List<Object> get props => [locationId];
}
