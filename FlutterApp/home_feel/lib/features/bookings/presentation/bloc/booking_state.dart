import 'package:equatable/equatable.dart';
import '../../data/models/booking_detail_response_dto.dart';
import '../../data/models/booking_list_response_dto.dart';

abstract class BookingState extends Equatable {
  @override
  List<Object?> get props => [];
}

class BookingInitial extends BookingState {}

class BookingLoading extends BookingState {}

class BookingSuccess extends BookingState {
  final String bookingId;
  final String message;

  BookingSuccess({required this.bookingId, required this.message});

  @override
  List<Object?> get props => [bookingId, message];
}

class BookingError extends BookingState {
  final String message;

  BookingError(this.message);

  @override
  List<Object?> get props => [message];
}

class ConfirmBookingSuccess extends BookingState {
  final String maPDPhong;
  final String maHD;
  final double totalAmount;
  final String status;

  ConfirmBookingSuccess({
    required this.maPDPhong,
    required this.maHD,
    required this.totalAmount,
    required this.status,
  });

  @override
  List<Object?> get props => [maPDPhong, maHD, totalAmount, status];
}

class BookingDetailLoaded extends BookingState {
  final BookingDetailResponseDto detail;

  BookingDetailLoaded(this.detail);

  @override
  List<Object?> get props => [detail];
}

class BookingPaymentSuccess extends BookingState {
  final String message;

  BookingPaymentSuccess(this.message);

  @override
  List<Object?> get props => [message];
}

class MyBookingsLoaded extends BookingState {
  final List<BookingListResponseDto> bookings;

  MyBookingsLoaded(this.bookings);

  @override
  List<Object?> get props => [bookings];
}

class BookingCancelSuccess extends BookingState {
  final String message;

  BookingCancelSuccess(this.message);

  @override
  List<Object?> get props => [message];
}
