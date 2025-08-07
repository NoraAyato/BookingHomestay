class ApiResponse<T> {
  final bool success;
  final String message;
  final T? data;

  ApiResponse({required this.success, required this.message, this.data});

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic) fromJsonT,
  ) {
    final bool hasSuccess = json.containsKey('success');
    return ApiResponse(
      success: hasSuccess ? json['success'] : false,
      message: json['message'] ?? json['error'] ?? 'Lỗi không xác định',
      data: hasSuccess && json['data'] != null ? fromJsonT(json['data']) : null,
    );
  }
}
