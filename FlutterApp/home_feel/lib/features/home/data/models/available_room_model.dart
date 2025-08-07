class AvailableRoomModel {
  @override
  String toString() {
    return 'AvailableRoomModel(maPhong: $maPhong, tenPhong: $tenPhong, giaTien: $giaTien)';
  }

  final String maPhong;
  final String tenPhong;
  final num giaTien;

  AvailableRoomModel({
    required this.maPhong,
    required this.tenPhong,
    required this.giaTien,
  });

  factory AvailableRoomModel.fromJson(Map<String, dynamic> json) {
    return AvailableRoomModel(
      maPhong: json['maPhong'] as String,
      tenPhong: json['tenPhong'] as String,
      giaTien: json['giaTien'] as num,
    );
  }

  Map<String, dynamic> toJson() => {
    'maPhong': maPhong,
    'tenPhong': tenPhong,
    'giaTien': giaTien,
  };
}
