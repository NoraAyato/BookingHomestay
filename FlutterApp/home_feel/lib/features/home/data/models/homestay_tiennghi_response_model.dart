class HomestayTienNghiResponseModel {
  final String homestayId;
  final List<TienNghiModel> tienNghis;

  HomestayTienNghiResponseModel({
    required this.homestayId,
    required this.tienNghis,
  });

  factory HomestayTienNghiResponseModel.fromJson(Map<String, dynamic> json) {
    return HomestayTienNghiResponseModel(
      homestayId: json['homestayId'] as String,
      tienNghis: (json['tienNghis'] as List<dynamic>)
          .map((e) => TienNghiModel.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class TienNghiModel {
  final String maTienNghi;
  final String tenTienNghi;
  final String moTa;
  final int soLuong;

  TienNghiModel({
    required this.maTienNghi,
    required this.tenTienNghi,
    required this.moTa,
    required this.soLuong,
  });

  factory TienNghiModel.fromJson(Map<String, dynamic> json) {
    return TienNghiModel(
      maTienNghi: json['maTienNghi'] as String,
      tenTienNghi: json['tenTienNghi'] as String,
      moTa: json['moTa'] as String,
      soLuong: json['soLuong'] as int,
    );
  }
}
