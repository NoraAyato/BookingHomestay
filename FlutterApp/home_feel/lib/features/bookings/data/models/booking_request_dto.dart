class BookingRequestDto {
  final String maPhong;
  final DateTime ngayDen;
  final DateTime ngayDi;

  BookingRequestDto({
    required this.maPhong,
    required this.ngayDen,
    required this.ngayDi,
  });

  Map<String, dynamic> toJson() => {
    'maPhong': maPhong,
    'ngayDen': ngayDen.toIso8601String(),
    'ngayDi': ngayDi.toIso8601String(),
  };
}
