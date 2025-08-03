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
