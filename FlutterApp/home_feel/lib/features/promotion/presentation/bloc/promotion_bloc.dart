import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/features/promotion/domain/usecases/get_admin_khuyen_mai_usecase.dart';
import 'package:home_feel/features/promotion/domain/usecases/get_khuyen_mai_by_id_usecase.dart';
import 'package:home_feel/features/promotion/domain/usecases/get_my_promotion_usecase.dart';
import 'package:home_feel/features/promotion/presentation/bloc/promotion_event.dart';
import 'package:home_feel/features/promotion/presentation/bloc/promotion_state.dart';

class PromotionBloc extends Bloc<PromotionEvent, PromotionState> {
  final GetAdminKhuyenMaiUseCase getAdminKhuyenMaiUseCase;
  final GetKhuyenMaiByIdUseCase getKhuyenMaiByIdUseCase;
  final GetMyPromotionUseCase getMyPromotionUseCase;

  PromotionBloc({
    required this.getAdminKhuyenMaiUseCase,
    required this.getKhuyenMaiByIdUseCase,
    required this.getMyPromotionUseCase,
  }) : super(PromotionInitial()) {
    on<GetAdminKhuyenMaiEvent>(_onGetAdminKhuyenMai);
    on<GetKhuyenMaiByIdEvent>(_onGetKhuyenMaiById);
    on<GetMyPromotionEvent>(_onGetMyPromotion);
  }

  Future<void> _onGetAdminKhuyenMai(
    GetAdminKhuyenMaiEvent event,
    Emitter<PromotionState> emit,
  ) async {
    emit(PromotionLoading());
    try {
      final result = await getAdminKhuyenMaiUseCase();
      if (result.success) {
        emit(PromotionsLoaded(result.data!));
      } else {
        emit(PromotionError(result.message));
      }
    } catch (e) {
      emit(PromotionError(e.toString()));
    }
  }

  Future<void> _onGetKhuyenMaiById(
    GetKhuyenMaiByIdEvent event,
    Emitter<PromotionState> emit,
  ) async {
    emit(PromotionLoading());
    try {
      final result = await getKhuyenMaiByIdUseCase(event.kmId);
      if (result.success) {
        emit(PromotionLoaded(result.data!));
      } else {
        emit(PromotionError(result.message));
      }
    } catch (e) {
      emit(PromotionError(e.toString()));
    }
  }

  Future<void> _onGetMyPromotion(
    GetMyPromotionEvent event,
    Emitter<PromotionState> emit,
  ) async {
    emit(PromotionLoading());
    try {
      final promotions = await getMyPromotionUseCase(
        maPhong: event.maPhong,
        ngayDen: event.ngayDen,
        ngayDi: event.ngayDi,
      );
      emit(MyPromotionsLoaded(promotions ?? []));
    } catch (e) {
      emit(PromotionError(e.toString()));
    }
  }
}
