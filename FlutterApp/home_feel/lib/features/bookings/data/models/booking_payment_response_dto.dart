class BookingPaymentResponseDto {
  final String maPDPhong;
  final String maHD;
  final double totalAmount;
  final String status;

  BookingPaymentResponseDto({
    required this.maPDPhong,
    required this.maHD,
    required this.totalAmount,
    required this.status,
  });

  factory BookingPaymentResponseDto.fromJson(Map<String, dynamic> json) {
    return BookingPaymentResponseDto(
      maPDPhong: json['maPDPhong'] as String,
      maHD: json['maHD'] as String,
      totalAmount: (json['totalAmount'] as num).toDouble(),
      status: json['status'] as String,
    );
  }
}
