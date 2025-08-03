class HomestayImageResponseModel {
  final String homestayId;
  final String mainImage;
  final List<String> roomImages;

  HomestayImageResponseModel({
    required this.homestayId,
    required this.mainImage,
    required this.roomImages,
  });

  factory HomestayImageResponseModel.fromJson(Map<String, dynamic> json) {
    return HomestayImageResponseModel(
      homestayId: json['homestayId'] as String,
      mainImage: json['mainImage'] as String,
      roomImages: (json['roomImages'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'homestayId': homestayId,
    'mainImage': mainImage,
    'roomImages': roomImages,
  };
}
