import 'package:equatable/equatable.dart';

class HomestaySuggestModel extends Equatable {
  final String tenHomestay;
  final String diaChi;
  final String khuVuc;

  const HomestaySuggestModel({
    required this.tenHomestay,
    required this.diaChi,
    required this.khuVuc,
  });

  factory HomestaySuggestModel.fromJson(Map<String, dynamic> json) {
    return HomestaySuggestModel(
      tenHomestay: json['tenHomestay'] as String,
      diaChi: json['diaChi'] as String,
      khuVuc: json['khuVuc'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'tenHomestay': tenHomestay,
    'diaChi': diaChi,
    'khuVuc': khuVuc,
  };

  HomestaySuggestModel copyWith({
    String? tenHomestay,
    String? diaChi,
    String? khuVuc,
  }) {
    return HomestaySuggestModel(
      tenHomestay: tenHomestay ?? this.tenHomestay,
      diaChi: diaChi ?? this.diaChi,
      khuVuc: khuVuc ?? this.khuVuc,
    );
  }

  @override
  List<Object?> get props => [tenHomestay, diaChi, khuVuc];
}
