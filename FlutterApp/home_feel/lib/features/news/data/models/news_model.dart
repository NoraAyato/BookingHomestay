import 'package:equatable/equatable.dart';

class NewsModel extends Equatable {
  final String maTinTuc;
  final String tieuDe;
  final String noiDung;
  final String hinhAnh;
  final DateTime ngayDang;
  final String tacGia;
  final String trangThai;
  final String? tenChuDe;

  const NewsModel({
    required this.maTinTuc,
    required this.tieuDe,
    required this.noiDung,
    required this.hinhAnh,
    required this.ngayDang,
    required this.tacGia,
    required this.trangThai,
    this.tenChuDe,
  });

  factory NewsModel.fromJson(Map<String, dynamic> json) {
    return NewsModel(
      maTinTuc: json['maTinTuc'] as String,
      tieuDe: json['tieuDe'] as String,
      noiDung: json['noiDung'] as String,
      hinhAnh: json['hinhAnh'] as String,
      ngayDang: DateTime.parse(json['ngayDang']),
      tacGia: json['tacGia'] as String,
      trangThai: json['trangThai'] as String,
      tenChuDe: json['tenChuDe'] as String?,
    );
  }

  @override
  List<Object?> get props => [
    maTinTuc,
    tieuDe,
    noiDung,
    hinhAnh,
    ngayDang,
    tacGia,
    trangThai,
    tenChuDe,
  ];
}
