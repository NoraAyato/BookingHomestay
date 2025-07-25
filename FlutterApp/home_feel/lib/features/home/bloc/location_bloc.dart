import 'package:flutter_bloc/flutter_bloc.dart';
import '../domain/usecases/fetch_locations_use_case.dart';

import 'location_event.dart';
import 'location_state.dart';

class LocationBloc extends Bloc<LocationEvent, LocationState> {
  final FetchLocationsUseCase fetchLocationsUseCase;

  LocationBloc(this.fetchLocationsUseCase) : super(LocationInitial()) {
    on<FetchLocationsEvent>((event, emit) async {
      emit(LocationLoading());
      try {
        final locations = await fetchLocationsUseCase();
        emit(LocationLoaded(locations));
      } catch (e) {
        emit(LocationError(e.toString()));
      }
    });
  }
}
