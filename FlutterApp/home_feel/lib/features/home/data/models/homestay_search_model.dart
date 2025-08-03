import 'package:equatable/equatable.dart';

class HomestaySearchModel extends Equatable {
  final String id;
  final String tenHomestay;
  final String diaChi;
  final String khuVuc;

  const HomestaySearchModel({
    required this.id,
    required this.tenHomestay,
    required this.diaChi,
    required this.khuVuc,
  });

  factory HomestaySearchModel.fromJson(Map<String, dynamic> json) {
    return HomestaySearchModel(
      id: json['id'] as String,
      tenHomestay: json['tenHomestay'] as String,
      diaChi: json['diaChi'] as String,
      khuVuc: json['khuVuc'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'tenHomestay': tenHomestay,
    'diaChi': diaChi,
    'khuVuc': khuVuc,
  };

  @override
  List<Object?> get props => [id, tenHomestay, diaChi, khuVuc];
}
