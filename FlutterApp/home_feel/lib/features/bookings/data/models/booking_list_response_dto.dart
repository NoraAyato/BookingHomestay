import 'package:intl/intl.dart';

class BookingListResponseDto {
  final String maPDPhong;
  final DateTime ngayLap;
  final String trangThai;
  final String tenHomestay;
  final String tenPhong;
  final double tongTien;

  BookingListResponseDto({
    required this.maPDPhong,
    required this.ngayLap,
    required this.trangThai,
    required this.tenHomestay,
    required this.tenPhong,
    required this.tongTien,
  });

  factory BookingListResponseDto.fromJson(Map<String, dynamic> json) {
    return BookingListResponseDto(
      maPDPhong: json['maPDPhong'] ?? '',
      ngayLap: json['ngayLap'] != null
          ? DateTime.parse(json['ngayLap'])
          : DateTime.now(),
      trangThai: json['trangThai'] ?? '',
      tenHomestay: json['tenHomestay'] ?? '',
      tenPhong: json['tenPhong'] ?? '',
      tongTien: json['tongTien'] != null
          ? double.parse(json['tongTien'].toString())
          : 0.0,
    );
  }

  String get formattedDate => DateFormat('dd/MM/yyyy').format(ngayLap);
  String get formattedPrice =>
      NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(tongTien);

  Map<String, dynamic> toJson() {
    return {
      'maPDPhong': maPDPhong,
      'ngayLap': ngayLap.toIso8601String(),
      'trangThai': trangThai,
      'tenHomestay': tenHomestay,
      'tenPhong': tenPhong,
      'tongTien': tongTien,
    };
  }
}
