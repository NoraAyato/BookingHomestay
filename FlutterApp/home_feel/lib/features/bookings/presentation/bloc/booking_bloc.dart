import 'package:flutter_bloc/flutter_bloc.dart';
import 'booking_event.dart';
import 'booking_state.dart';
import '../../domain/usecases/create_booking_usecase.dart';
import '../../domain/usecases/confirm_booking_usecase.dart';
import '../../domain/usecases/get_booking_detail_usecase.dart';
import '../../domain/usecases/booking_payment_usecase.dart';

class BookingBloc extends Bloc<BookingEvent, BookingState> {
  final CreateBookingUseCase createBookingUseCase;
  final ConfirmBookingUseCase confirmBookingUseCase;
  final GetBookingDetailUseCase getBookingDetailUseCase;
  final BookingPaymentUseCase bookingPaymentUseCase;

  BookingBloc({
    required this.createBookingUseCase,
    required this.confirmBookingUseCase,
    required this.getBookingDetailUseCase,
    required this.bookingPaymentUseCase,
  }) : super(BookingInitial()) {
    on<CreateBookingEvent>(_onCreateBooking);
    on<ConfirmBookingEvent>(_onConfirmBooking);
    on<GetBookingDetailEvent>(_onGetBookingDetail);
    on<BookingPaymentEvent>(_onBookingPayment);
  }

  Future<void> _onCreateBooking(
    CreateBookingEvent event,
    Emitter<BookingState> emit,
  ) async {
    emit(BookingLoading());
    try {
      final bookingId = await createBookingUseCase(
        maPhong: event.maPhong,
        ngayDen: event.ngayDen,
        ngayDi: event.ngayDi,
      );
      if (bookingId != null) {
        emit(
          BookingSuccess(
            bookingId: bookingId,
            message: 'Booking created successfully',
          ),
        );
      } else {
        emit(BookingError('Có lỗi xảy ra khi tạo booking'));
      }
    } catch (e) {
      emit(BookingError(e.toString()));
    }
  }

  Future<void> _onConfirmBooking(
    ConfirmBookingEvent event,
    Emitter<BookingState> emit,
  ) async {
    emit(BookingLoading());
    try {
      final result = await confirmBookingUseCase(
        maPDPhong: event.maPDPhong,
        serviceIds: event.serviceIds,
        promotionId: event.promotionId,
      );
      if (result != null) {
        emit(
          ConfirmBookingSuccess(
            maPDPhong: result.maPDPhong,
            maHD: result.maHD,
            totalAmount: result.totalAmount,
            status: result.status,
          ),
        );
      } else {
        emit(BookingError('Có lỗi xảy ra khi xác nhận booking'));
      }
    } catch (e) {
      emit(BookingError(e.toString()));
    }
  }

  Future<void> _onGetBookingDetail(
    GetBookingDetailEvent event,
    Emitter<BookingState> emit,
  ) async {
    emit(BookingLoading());
    try {
      final detail = await getBookingDetailUseCase(bookingId: event.bookingId);
      if (detail != null) {
        emit(BookingDetailLoaded(detail));
      } else {
        emit(BookingError('Không lấy được chi tiết booking'));
      }
    } catch (e) {
      emit(BookingError(e.toString()));
    }
  }

  Future<void> _onBookingPayment(
    BookingPaymentEvent event,
    Emitter<BookingState> emit,
  ) async {
    emit(BookingLoading());
    try {
      final success = await bookingPaymentUseCase(
        maPDPhong: event.maPDPhong,
        maHD: event.maHD,
        totalAmount: event.totalAmount,
        status: event.status,
      );
      if (success) {
        emit(BookingPaymentSuccess('Thanh toán booking thành công'));
      } else {
        emit(BookingError('Có lỗi xảy ra khi thanh toán booking'));
      }
    } catch (e) {
      emit(BookingError(e.toString()));
    }
  }
}
