class BookingDetailResponseDto {
  final String maPDPhong;
  final String tenHomestay;
  final String diaChiHomestay;
  final String tenLoaiPhong;
  final String tenPhong;
  final String hinhAnhPhong;
  final String userName;
  final String soDienThoai;
  final double tongTienPhong;
  final String chinhSachHuyPhong;
  final String chinhSachNhanPhong;
  final String chinhSachTraPhong;
  final String ngayNhanPhong;
  final String ngayTraPhong;
  final List<String> dichVuSuDung;

  BookingDetailResponseDto({
    required this.maPDPhong,
    required this.tenHomestay,
    required this.diaChiHomestay,
    required this.tenLoaiPhong,
    required this.tenPhong,
    required this.hinhAnhPhong,
    required this.userName,
    required this.soDienThoai,
    required this.tongTienPhong,
    required this.chinhSachHuyPhong,
    required this.chinhSachNhanPhong,
    required this.chinhSachTraPhong,
    required this.ngayNhanPhong,
    required this.ngayTraPhong,
    required this.dichVuSuDung,
  });

  factory BookingDetailResponseDto.fromJson(Map<String, dynamic> json) {
    return BookingDetailResponseDto(
      maPDPhong: json['maPDPhong'] as String,
      tenHomestay: json['tenHomestay'] as String,
      diaChiHomestay: json['diaChiHomestay'] as String,
      tenLoaiPhong: json['tenLoaiPhong'] as String,
      tenPhong: json['tenPhong'] as String,
      hinhAnhPhong: json['hinhAnhPhong'] as String,
      userName: json['userName'] as String,
      soDienThoai: json['soDienThoai'] as String,
      tongTienPhong: (json['tongTienPhong'] as num).toDouble(),
      chinhSachHuyPhong: json['chinhSachHuyPhong'] as String,
      chinhSachNhanPhong: json['chinhSachNhanPhong'] as String,
      chinhSachTraPhong: json['chinhSachTraPhong'] as String,
      ngayNhanPhong: json['ngayNhanPhong'] as String,
      ngayTraPhong: json['ngayTraPhong'] as String,
      dichVuSuDung: List<String>.from(json['dichVuSuDung'] ?? []),
    );
  }
}
