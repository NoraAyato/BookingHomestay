import 'package:equatable/equatable.dart';

abstract class NewsEvent extends Equatable {
  const NewsEvent();

  @override
  List<Object?> get props => [];
}

class GetAllNewsEvent extends NewsEvent {
  final bool refresh;

  const GetAllNewsEvent({this.refresh = false});

  @override
  List<Object?> get props => [refresh];
}

class GetNewsDetailEvent extends NewsEvent {
  final String maTinTuc;

  const GetNewsDetailEvent(this.maTinTuc);

  @override
  List<Object?> get props => [maTinTuc];
}
