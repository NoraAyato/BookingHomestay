import 'package:flutter_bloc/flutter_bloc.dart';

class LoadingState {
  final bool isLoading;
  const LoadingState(this.isLoading);
}

class LoadingBloc extends Cubit<LoadingState> {
  LoadingBloc() : super(const LoadingState(false));

  void show() => emit(const LoadingState(true));
  void hide() => emit(const LoadingState(false));
}
