import 'dart:convert';

class RoomDetailModel {
  final String maPhong;
  final String tenPhong;
  final int soNguoi;
  final String tenLoai;
  final double donGia;
  final String nhanPhong;
  final String traPhong;
  final String huyPhong;

  RoomDetailModel({
    required this.maPhong,
    required this.tenPhong,
    required this.soNguoi,
    required this.tenLoai,
    required this.donGia,
    required this.nhanPhong,
    required this.traPhong,
    required this.huyPhong,
  });

  factory RoomDetailModel.fromJson(Map<String, dynamic> json) {
    return RoomDetailModel(
      maPhong: json['maPhong'] ?? '',
      tenPhong: json['tenPhong'] ?? '',
      soNguoi: json['soNguoi'] ?? 0,
      tenLoai: json['tenLoai'] ?? '',
      donGia: json['donGia'] != null
          ? (json['donGia'] is int
                ? (json['donGia'] as int).toDouble()
                : json['donGia'] as double)
          : 0.0,
      nhanPhong: json['nhanPhong'] ?? '',
      traPhong: json['traPhong'] ?? '',
      huyPhong: json['huyPhong'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'maPhong': maPhong,
      'tenPhong': tenPhong,
      'soNguoi': soNguoi,
      'tenLoai': tenLoai,
      'donGia': donGia,
      'nhanPhong': nhanPhong,
      'traPhong': traPhong,
      'huyPhong': huyPhong,
    };
  }

  @override
  String toString() {
    return 'RoomDetailModel(maPhong: $maPhong, tenPhong: $tenPhong, soNguoi: $soNguoi, tenLoai: $tenLoai, donGia: $donGia, nhanPhong: $nhanPhong, traPhong: $traPhong, huyPhong: $huyPhong)';
  }
}
