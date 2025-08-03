import 'package:home_feel/features/location/data/models/location_model.dart';

import 'package:equatable/equatable.dart';

abstract class LocationState extends Equatable {
  const LocationState();

  @override
  List<Object> get props => [];
}

class LocationInitial extends LocationState {}

class LocationLoading extends LocationState {}

class LocationsLoaded extends LocationState {
  final List<LocationModel> locations;

  const LocationsLoaded(this.locations);

  @override
  List<Object> get props => [locations];
}

class ProvincesLoaded extends LocationState {
  final List<LocationModel> provinces;

  const ProvincesLoaded(this.provinces);

  @override
  List<Object> get props => [provinces];
}

class DistrictsLoaded extends LocationState {
  final List<LocationModel> districts;
  final int provinceId;

  const DistrictsLoaded(this.districts, this.provinceId);

  @override
  List<Object> get props => [districts, provinceId];
}

class WardsLoaded extends LocationState {
  final List<LocationModel> wards;
  final int districtId;

  const WardsLoaded(this.wards, this.districtId);

  @override
  List<Object> get props => [wards, districtId];
}

class LocationDetailLoaded extends LocationState {
  final LocationModel location;

  const LocationDetailLoaded(this.location);

  @override
  List<Object> get props => [location];
}

class LocationError extends LocationState {
  final String message;
  final String? errorDetails;

  const LocationError({required this.message, this.errorDetails});

  @override
  List<Object> get props => [message];
}
