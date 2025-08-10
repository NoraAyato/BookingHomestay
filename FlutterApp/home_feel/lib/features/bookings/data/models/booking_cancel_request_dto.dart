class BookingCancelRequestDto {
  final String maPDPhong;
  final String lyDoHuy;
  final String tenNganHang;
  final String soTaiKhoan;

  BookingCancelRequestDto({
    required this.maPDPhong,
    required this.lyDoHuy,
    required this.tenNganHang,
    required this.soTaiKhoan,
  });

  Map<String, dynamic> toJson() => {
    'maPDPhong': maPDPhong,
    'lyDoHuy': lyDoHuy,
    'tenNganHang': tenNganHang,
    'soTaiKhoan': soTaiKhoan,
  };
}
