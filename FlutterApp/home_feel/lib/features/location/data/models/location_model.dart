class LocationModel {
  final String maKv; // Thay "id" bằng "maKv"
  final String tenKv; // Thay "name" bằng "tenKv"

  LocationModel({required this.maKv, required this.tenKv});

  factory LocationModel.fromJson(Map<String, dynamic> json) {
    return LocationModel(
      maKv: json['maKv'] as String, // Lấy giá trị từ "maKv"
      tenKv: json['tenKv'] as String, // Lấy giá trị từ "tenKv"
    );
  }
}
