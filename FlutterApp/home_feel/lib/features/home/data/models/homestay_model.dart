import 'package:equatable/equatable.dart';

class HomestayModel extends Equatable {
  final String id;
  final String tenHomestay;
  final String hinhAnh;
  final double pricePerNight;
  final String diaChi;
  final int hang;
  final bool hasDiscount;
  final double discountPercentage;

  const HomestayModel({
    required this.id,
    required this.tenHomestay,
    required this.hinhAnh,
    required this.pricePerNight,
    required this.diaChi,
    required this.hang,
    this.hasDiscount = false,
    this.discountPercentage = 0.0,
  });

  @override
  List<Object?> get props => [
    id,
    tenHomestay,
    hinhAnh,
    pricePerNight,
    diaChi,
    hang,
    hasDiscount,
    discountPercentage,
  ];

  factory HomestayModel.fromJson(Map<String, dynamic> json) {
    return HomestayModel(
      id: json['id'] as String? ?? '',
      tenHomestay: json['tenHomestay'] as String? ?? '',
      hinhAnh: json['hinhAnh'] as String? ?? '',
      pricePerNight: (json['pricePerNight'] as num?)?.toDouble() ?? 0.0,
      diaChi: json['diaChi'] as String? ?? '',
      hang: (json['hang'] as num?)?.toInt() ?? 0,
      hasDiscount: json['hasDiscount'] as bool? ?? false,
      discountPercentage:
          (json['discountPercentage'] as num?)?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'tenHomestay': tenHomestay,
    'hinhAnh': hinhAnh,
    'pricePerNight': pricePerNight,
    'diaChi': diaChi,
    'hang': hang,
    'hasDiscount': hasDiscount,
    'discountPercentage': discountPercentage,
  };

  HomestayModel copyWith({
    String? id,
    String? tenHomestay,
    String? hinhAnh,
    double? pricePerNight,
    String? diaChi,
    int? hang,
    bool? hasDiscount,
    double? discountPercentage,
  }) {
    return HomestayModel(
      id: id ?? this.id,
      tenHomestay: tenHomestay ?? this.tenHomestay,
      hinhAnh: hinhAnh ?? this.hinhAnh,
      pricePerNight: pricePerNight ?? this.pricePerNight,
      diaChi: diaChi ?? this.diaChi,
      hang: hang ?? this.hang,
      hasDiscount: hasDiscount ?? this.hasDiscount,
      discountPercentage: discountPercentage ?? this.discountPercentage,
    );
  }
}
