import 'package:flutter_bloc/flutter_bloc.dart';

class LoadingState {
  final bool isLoading;
  final int loadingCount; // Đếm số request đang chạy

  const LoadingState({required this.isLoading, required this.loadingCount});

  LoadingState copyWith({bool? isLoading, int? loadingCount}) {
    return LoadingState(
      isLoading: isLoading ?? this.isLoading,
      loadingCount: loadingCount ?? this.loadingCount,
    );
  }
}

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
