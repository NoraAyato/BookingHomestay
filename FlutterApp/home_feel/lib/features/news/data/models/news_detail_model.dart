import 'package:equatable/equatable.dart';

class NewsDetailModel extends Equatable {
  final String maTinTuc;
  final String tieuDe;
  final String noiDung;
  final String hinhAnh;
  final DateTime ngayDang;
  final String tacGia;

  const NewsDetailModel({
    required this.maTinTuc,
    required this.tieuDe,
    required this.noiDung,
    required this.hinhAnh,
    required this.ngayDang,
    required this.tacGia,
  });

  factory NewsDetailModel.fromJson(Map<String, dynamic> json) {
    return NewsDetailModel(
      maTinTuc: json['maTinTuc'],
      tieuDe: json['tieuDe'],
      noiDung: json['noiDung'],
      hinhAnh: json['hinhAnh'],
      ngayDang: DateTime.parse(json['ngayDang']),
      tacGia: json['tacGia'],
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
  ];
}
