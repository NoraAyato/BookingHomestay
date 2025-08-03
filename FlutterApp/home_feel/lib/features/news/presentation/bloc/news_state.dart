import 'package:equatable/equatable.dart';
import '../../data/models/news_model.dart';
import '../../data/models/news_detail_model.dart';

abstract class NewsState extends Equatable {
  const NewsState();

  @override
  List<Object?> get props => [];
}

class NewsInitial extends NewsState {}

class NewsLoading extends NewsState {}

class NewsLoaded extends NewsState {
  final List<NewsModel> news;

  const NewsLoaded(this.news);

  @override
  List<Object?> get props => [news];
}

class NewsDetailLoaded extends NewsState {
  final NewsDetailModel newsDetail;

  const NewsDetailLoaded(this.newsDetail);

  @override
  List<Object?> get props => [newsDetail];
}

class NewsError extends NewsState {
  final String message;

  const NewsError(this.message);

  @override
  List<Object?> get props => [message];
}
