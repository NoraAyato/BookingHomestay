class RoomImagesModel {
  final String maPhong;
  final List<String> urlAnhs;

  RoomImagesModel({required this.maPhong, required this.urlAnhs});

  factory RoomImagesModel.fromJson(Map<String, dynamic> json) {
    return RoomImagesModel(
      maPhong: json['maPhong'] as String,
      urlAnhs: (json['urlAnhs'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {'maPhong': maPhong, 'urlAnhs': urlAnhs};
}
