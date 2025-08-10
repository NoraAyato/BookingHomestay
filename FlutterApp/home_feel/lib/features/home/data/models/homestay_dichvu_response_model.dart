class HomestayDichVuResponseModel {
  final String homestayId;
  final List<DichVuDto> dichVus;

  HomestayDichVuResponseModel({
    required this.homestayId,
    required this.dichVus,
  });

  factory HomestayDichVuResponseModel.fromJson(Map<String, dynamic> json) {
    return HomestayDichVuResponseModel(
      homestayId: json['homestayId'] as String,
      dichVus: (json['dichVus'] as List<dynamic>)
          .map((e) => DichVuDto.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class DichVuDto {
  final String maDV;
  final String tenDV;
  final double donGia;
  final String hinhAnh;

  DichVuDto({
    required this.maDV,
    required this.tenDV,
    required this.donGia,
    required this.hinhAnh,
  });

  factory DichVuDto.fromJson(Map<String, dynamic> json) {
    return DichVuDto(
      maDV: json['maDV'] as String,
      tenDV: json['tenDV'] as String,
      donGia: (json['donGia'] as num).toDouble(),
      hinhAnh: json['hinhAnh'] as String,
    );
  }
}
