class ConfirmBookingRequestDto {
  final String maPDPhong;
  final List<String> serviceIds;
  final String promotionId;

  ConfirmBookingRequestDto({
    required this.maPDPhong,
    required this.serviceIds,
    required this.promotionId,
  });

  Map<String, dynamic> toJson() => {
    'maPDPhong': maPDPhong,
    'serviceIds': serviceIds,
    'promotionId': promotionId,
  };
}
