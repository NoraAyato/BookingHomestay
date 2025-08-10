import 'package:flutter_bloc/flutter_bloc.dart';
import 'booking_event.dart';
import 'booking_state.dart';
import '../../domain/usecases/create_booking_usecase.dart';
import '../../domain/usecases/confirm_booking_usecase.dart';
import '../../domain/usecases/get_booking_detail_usecase.dart';
import '../../domain/usecases/booking_payment_usecase.dart';
import '../../domain/usecases/get_my_bookings_usecase.dart';
import '../../domain/usecases/cancel_booking_usecase.dart';

class BookingBloc extends Bloc<BookingEvent, BookingState> {
  final CreateBookingUseCase createBookingUseCase;
  final ConfirmBookingUseCase confirmBookingUseCase;
  final GetBookingDetailUseCase getBookingDetailUseCase;
  final BookingPaymentUseCase bookingPaymentUseCase;
  final GetMyBookingsUseCase getMyBookingsUseCase;
  final CancelBookingUseCase cancelBookingUseCase;

  BookingBloc({
    required this.createBookingUseCase,
    required this.confirmBookingUseCase,
    required this.getBookingDetailUseCase,
    required this.bookingPaymentUseCase,
    required this.getMyBookingsUseCase,
    required this.cancelBookingUseCase,
  }) : super(BookingInitial()) {
    on<CreateBookingEvent>(_onCreateBooking);
    on<ConfirmBookingEvent>(_onConfirmBooking);
    on<GetBookingDetailEvent>(_onGetBookingDetail);
    on<BookingPaymentEvent>(_onBookingPayment);
    on<GetMyBookingsEvent>(_onGetMyBookings);
    on<CancelBookingEvent>(_onCancelBooking);
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
        soTien: event.soTien,
        phuongThuc: event.phuongThuc,
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

  Future<void> _onGetMyBookings(
    GetMyBookingsEvent event,
    Emitter<BookingState> emit,
  ) async {
    emit(BookingLoading());
    try {
      final bookings = await getMyBookingsUseCase();
      emit(MyBookingsLoaded(bookings!));
    } catch (e) {
      emit(BookingError(e.toString()));
    }
  }

  Future<void> _onCancelBooking(
    CancelBookingEvent event,
    Emitter<BookingState> emit,
  ) async {
    emit(BookingLoading());
    try {
      final response = await cancelBookingUseCase(
        maPDPhong: event.maPDPhong,
        lyDoHuy: event.lyDoHuy,
        tenNganHang: event.tenNganHang,
        soTaiKhoan: event.soTaiKhoan,
      );

      if (response.success) {
        emit(BookingCancelSuccess('Hủy đặt phòng thành công'));
      } else {
        // Sử dụng thông báo lỗi từ server hoặc thông báo mặc định
        final errorMessage = response.message.isNotEmpty
            ? response.message
            : 'Có lỗi xảy ra khi hủy đặt phòng';
        emit(BookingError(errorMessage));
      }
    } catch (e) {
      emit(BookingError(e.toString()));
    }
  }
}
