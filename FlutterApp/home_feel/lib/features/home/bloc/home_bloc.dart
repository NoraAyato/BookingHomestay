import 'package:flutter_bloc/flutter_bloc.dart';
import '../domain/usecases/fetch_homestays_use_case.dart';
import '../data/models/homestay_model.dart';

import 'home_event.dart';
import 'home_state.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  final FetchHomestaysUseCase fetchHomestaysUseCase;

  HomeBloc(this.fetchHomestaysUseCase) : super(HomeInitial()) {
    on<FetchHomestaysEvent>((event, emit) async {
      emit(HomeLoading());
      try {
        final homestays = await fetchHomestaysUseCase(
          location: event.location,
          filterType: event.filterType,
        );
        emit(HomeLoaded(homestays));
      } catch (e) {
        emit(HomeError(e.toString()));
      }
    });
  }
}
