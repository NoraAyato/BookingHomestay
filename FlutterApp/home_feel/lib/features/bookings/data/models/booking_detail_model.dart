class BookingDetailModel {
  final String maPDP;
  final String tenPhong;
  final String? tenLoaiPhong;
  final DateTime ngayDen;
  final DateTime ngayDi;
  final String? gioVao;
  final String? gioRa;
  final int? sLNguoi;
  final double tongTien;
  final String? tenKH;
  final String? sdt;
  final String? email;
  final String trangThai;

  BookingDetailModel({
    required this.maPDP,
    required this.tenPhong,
    this.tenLoaiPhong,
    required this.ngayDen,
    required this.ngayDi,
    this.gioVao,
    this.gioRa,
    this.sLNguoi,
    required this.tongTien,
    this.tenKH,
    this.sdt,
    this.email,
    required this.trangThai,
  });

  factory BookingDetailModel.fromJson(Map<String, dynamic> json) {
    return BookingDetailModel(
      maPDP: json['maPDP'],
      tenPhong: json['tenPhong'],
      tenLoaiPhong: json['tenLoaiPhong'],
      ngayDen: DateTime.parse(json['ngayDen']),
      ngayDi: DateTime.parse(json['ngayDi']),
      gioVao: json['gioVao'],
      gioRa: json['gioRa'],
      sLNguoi: json['sLNguoi'],
      tongTien: (json['tongTien'] as num).toDouble(),
      tenKH: json['tenKH'],
      sdt: json['sdt'],
      email: json['email'],
      trangThai: json['trangThai'] ?? 'Chờ xác nhận',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'maPDP': maPDP,
      'tenPhong': tenPhong,
      'tenLoaiPhong': tenLoaiPhong,
      'ngayDen': ngayDen.toIso8601String(),
      'ngayDi': ngayDi.toIso8601String(),
      'gioVao': gioVao,
      'gioRa': gioRa,
      'sLNguoi': sLNguoi,
      'tongTien': tongTien,
      'tenKH': tenKH,
      'sdt': sdt,
      'email': email,
      'trangThai': trangThai,
    };
  }
}
