import 'package:equatable/equatable.dart';

abstract class PromotionEvent extends Equatable {
  @override
  List<Object> get props => [];
}

class GetAdminKhuyenMaiEvent extends PromotionEvent {}

class GetKhuyenMaiByIdEvent extends PromotionEvent {
  final String kmId;

  GetKhuyenMaiByIdEvent(this.kmId);

  @override
  List<Object> get props => [kmId];
}

class GetMyPromotionEvent extends PromotionEvent {
  final String maPDPhong;
  final DateTime ngayDen;
  final DateTime ngayDi;

  GetMyPromotionEvent({
    required this.maPDPhong,
    required this.ngayDen,
    required this.ngayDi,
  });

  @override
  List<Object> get props => [maPDPhong, ngayDen, ngayDi];
}
