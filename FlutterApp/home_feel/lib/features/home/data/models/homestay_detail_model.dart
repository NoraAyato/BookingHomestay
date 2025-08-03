class HomestayDetailModel {
  final String id;
  final String tenHomestay;
  final String diaChi;
  final String gioiThieu;
  final double giaTien;
  final ChinhSachModel chinhSach;
  final int tongDanhGia;
  final double diemHaiLongTrungBinh;

  HomestayDetailModel({
    required this.id,
    required this.tenHomestay,
    required this.diaChi,
    required this.gioiThieu,
    required this.giaTien,
    required this.chinhSach,
    required this.tongDanhGia,
    required this.diemHaiLongTrungBinh,
  });

  factory HomestayDetailModel.fromJson(Map<String, dynamic> json) {
    return HomestayDetailModel(
      id: json['id'] as String,
      tenHomestay: json['tenHomestay'] as String,
      diaChi: json['diaChi'] as String,
      gioiThieu: json['gioiThieu'] as String,
      giaTien: json['giaTien'] as double,
      chinhSach: ChinhSachModel.fromJson(
        json['chinhSach'] as Map<String, dynamic>,
      ),
      tongDanhGia: json['tongDanhGia'] as int,
      diemHaiLongTrungBinh: (json['diemHaiLongTrungBinh'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'tenHomestay': tenHomestay,
    'diaChi': diaChi,
    'gioiThieu': gioiThieu,
    'giaTien': giaTien,
    'chinhSach': chinhSach.toJson(),
    'tongDanhGia': tongDanhGia,
    'diemHaiLongTrungBinh': diemHaiLongTrungBinh,
  };
}

class ChinhSachModel {
  final String nhanPhong;
  final String traPhong;
  final String huyPhong;
  final String buaAn;

  ChinhSachModel({
    required this.nhanPhong,
    required this.traPhong,
    required this.huyPhong,
    required this.buaAn,
  });

  factory ChinhSachModel.fromJson(Map<String, dynamic> json) {
    return ChinhSachModel(
      nhanPhong: json['nhanPhong'] as String,
      traPhong: json['traPhong'] as String,
      huyPhong: json['huyPhong'] as String,
      buaAn: json['buaAn'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'nhanPhong': nhanPhong,
    'traPhong': traPhong,
    'huyPhong': huyPhong,
    'buaAn': buaAn,
  };
}
