class PromotionModel {
  final String maKM;
  final String noiDung;
  final DateTime ngayBatDau;
  final DateTime ngayKetThuc;
  final double chietKhau;
  final String loaiChietKhau;
  final int? soDemToiThieu;
  final int? soNgayDatTruoc;
  final String? hinhAnh;
  final bool chiApDungChoKhachMoi;
  final bool apDungChoTatCaPhong;
  final String trangThai;
  final double? soLuong;
  final DateTime ngayTao;

  PromotionModel({
    required this.maKM,
    required this.noiDung,
    required this.ngayBatDau,
    required this.ngayKetThuc,
    required this.chietKhau,
    required this.loaiChietKhau,
    required this.soDemToiThieu,
    required this.soNgayDatTruoc,
    this.hinhAnh,
    required this.chiApDungChoKhachMoi,
    required this.apDungChoTatCaPhong,
    required this.trangThai,
    this.soLuong,
    required this.ngayTao,
  });

  factory PromotionModel.fromJson(Map<String, dynamic> json) {
    return PromotionModel(
      maKM: json['maKM'] as String,
      noiDung: json['noiDung'] as String,
      ngayBatDau: DateTime.parse(json['ngayBatDau'] as String),
      ngayKetThuc: DateTime.parse(json['ngayKetThuc'] as String),
      chietKhau: (json['chietKhau'] as num).toDouble(),
      loaiChietKhau: json['loaiChietKhau'] as String,
      soDemToiThieu: json['soDemToiThieu'] != null
          ? (json['soDemToiThieu'] as num).toInt()
          : null,
      soNgayDatTruoc: json['soNgayDatTruoc'] != null
          ? (json['soNgayDatTruoc'] as num).toInt()
          : null,
      hinhAnh: json['hinhAnh'] as String?,
      chiApDungChoKhachMoi: json['chiApDungChoKhachMoi'] as bool,
      apDungChoTatCaPhong: json['apDungChoTatCaPhong'] as bool,
      trangThai: json['trangThai'] as String,
      soLuong: json['soLuong'] != null
          ? (json['soLuong'] as num).toDouble()
          : null,
      ngayTao: DateTime.parse(json['ngayTao'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'maKM': maKM,
      'noiDung': noiDung,
      'ngayBatDau': ngayBatDau.toIso8601String(),
      'ngayKetThuc': ngayKetThuc.toIso8601String(),
      'chietKhau': chietKhau,
      'loaiChietKhau': loaiChietKhau,
      'soDemToiThieu': soDemToiThieu,
      'soNgayDatTruoc': soNgayDatTruoc,
      'hinhAnh': hinhAnh,
      'chiApDungChoKhachMoi': chiApDungChoKhachMoi,
      'apDungChoTatCaPhong': apDungChoTatCaPhong,
      'trangThai': trangThai,
      'soLuong': soLuong,
      'ngayTao': ngayTao.toIso8601String(),
    };
  }
}
