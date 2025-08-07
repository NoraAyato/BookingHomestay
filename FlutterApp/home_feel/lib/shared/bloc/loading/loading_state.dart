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
