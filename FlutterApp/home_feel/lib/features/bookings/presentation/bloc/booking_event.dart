import 'package:equatable/equatable.dart';

abstract class BookingEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class CreateBookingEvent extends BookingEvent {
  final String maPhong;
  final DateTime ngayDen;
  final DateTime ngayDi;

  CreateBookingEvent({
    required this.maPhong,
    required this.ngayDen,
    required this.ngayDi,
  });

  @override
  List<Object?> get props => [maPhong, ngayDen, ngayDi];
}

class ConfirmBookingEvent extends BookingEvent {
  final String maPDPhong;
  final List<String> serviceIds;
  final String promotionId;

  ConfirmBookingEvent({
    required this.maPDPhong,
    required this.serviceIds,
    required this.promotionId,
  });

  @override
  List<Object?> get props => [maPDPhong, serviceIds, promotionId];
}

class GetBookingDetailEvent extends BookingEvent {
  final String bookingId;

  GetBookingDetailEvent({required this.bookingId});

  @override
  List<Object?> get props => [bookingId];
}

class BookingPaymentEvent extends BookingEvent {
  final String maPDPhong;
  final String maHD;
  final double totalAmount;
  final String status;

  BookingPaymentEvent({
    required this.maPDPhong,
    required this.maHD,
    required this.totalAmount,
    required this.status,
  });

  @override
  List<Object?> get props => [maPDPhong, maHD, totalAmount, status];
}
