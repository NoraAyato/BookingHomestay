class HomestayModel {
  final String id;
  final String tenHomestay;
  final String hinhAnh;
  final double pricePerNight;
  final String diaChi;
  final double hang;
  final bool hasDiscount;
  final double discountPercentage;

  HomestayModel({
    required this.id,
    required this.tenHomestay,
    required this.hinhAnh,
    required this.pricePerNight,
    required this.diaChi,
    required this.hang,
    this.hasDiscount = false,
    this.discountPercentage = 0.0,
  });

  factory HomestayModel.fromJson(Map<String, dynamic> json) {
    return HomestayModel(
      id: json['id'] as String,
      tenHomestay: json['tenHomestay'] as String,
      hinhAnh: json['hinhAnh'] as String,
      pricePerNight: (json['pricePerNight'] as num).toDouble(),
      diaChi: json['diaChi'] as String,
      hang: (json['hang'] as num).toDouble(),
      hasDiscount: json['hasDiscount'] as bool? ?? false,
      discountPercentage: (json['discountPercentage'] as num? ?? 0.0)
          .toDouble(),
    );
  }
}
