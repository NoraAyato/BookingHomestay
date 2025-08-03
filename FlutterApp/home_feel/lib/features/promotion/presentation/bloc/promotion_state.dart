import 'package:equatable/equatable.dart';
import 'package:home_feel/features/promotion/data/models/promotion_model.dart';

abstract class PromotionState extends Equatable {
  @override
  List<Object?> get props => [];
}

class PromotionInitial extends PromotionState {}

class PromotionLoading extends PromotionState {}

class PromotionsLoaded extends PromotionState {
  final List<PromotionModel> promotions;

  PromotionsLoaded(this.promotions);

  @override
  List<Object?> get props => [promotions];
}

class PromotionLoaded extends PromotionState {
  final PromotionModel promotion;

  PromotionLoaded(this.promotion);

  @override
  List<Object?> get props => [promotion];
}

class PromotionError extends PromotionState {
  final String message;

  PromotionError(this.message);

  @override
  List<Object?> get props => [message];
}
