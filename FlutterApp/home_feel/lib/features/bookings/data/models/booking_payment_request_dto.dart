class BookingPaymentRequestDto {
  final String maPDPhong;
  final String maHD;
  final double totalAmount;
  final String status;

  BookingPaymentRequestDto({
    required this.maPDPhong,
    required this.maHD,
    required this.totalAmount,
    required this.status,
  });

  Map<String, dynamic> toJson() => {
    'maPDPhong': maPDPhong,
    'maHD': maHD,
    'totalAmount': totalAmount,
    'status': status,
  };
}
