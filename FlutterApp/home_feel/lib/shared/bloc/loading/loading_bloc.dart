import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/shared/bloc/loading/loading_state.dart';


class LoadingBloc extends Cubit<LoadingState> {
  LoadingBloc() : super(const LoadingState(isLoading: false, loadingCount: 0));

  void show() {
    final currentCount = state.loadingCount + 1;
    emit(LoadingState(isLoading: true, loadingCount: currentCount));
  }

  void hide() {
    final currentCount = state.loadingCount - 1;
    // Chỉ hide khi không còn request nào đang chạy
    emit(LoadingState(isLoading: currentCount > 0, loadingCount: currentCount));
  }

  // Reset về trạng thái ban đầu (dùng khi có lỗi)
  void reset() {
    emit(const LoadingState(isLoading: false, loadingCount: 0));
  }
}
