import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/usecases/get_all_news_use_case.dart';
import '../../domain/usecases/get_news_detail_use_case.dart';
import 'news_event.dart';
import 'news_state.dart';

class NewsBloc extends Bloc<NewsEvent, NewsState> {
  final GetAllNewsUseCase _getAllNewsUseCase;
  final GetNewsDetailUseCase _getNewsDetailUseCase;

  NewsBloc(this._getAllNewsUseCase, this._getNewsDetailUseCase)
    : super(NewsInitial()) {
    on<GetAllNewsEvent>(_onGetAllNews);
    on<GetNewsDetailEvent>(_onGetNewsDetail);
  }

  Future<void> _onGetAllNews(
    GetAllNewsEvent event,
    Emitter<NewsState> emit,
  ) async {
    print('GetAllNewsEvent received');
    emit(NewsLoading());
    try {
      final result = await _getAllNewsUseCase();
      print('GetAllNewsUseCase result: $result');
      if (result.success && result.data != null) {
        print('News loaded successfully: ${result.data!.length} items');
        emit(NewsLoaded(result.data!));
      } else {
        print('Failed to load news: ${result.message}');
        emit(NewsError(result.message ?? 'Failed to fetch news'));
      }
    } catch (e, stackTrace) {
      print('Error loading news: $e');
      print('Stack trace: $stackTrace');
      emit(NewsError(e.toString()));
    }
  }

  Future<void> _onGetNewsDetail(
    GetNewsDetailEvent event,
    Emitter<NewsState> emit,
  ) async {
    emit(NewsLoading());
    try {
      final result = await _getNewsDetailUseCase(event.maTinTuc);
      if (result.success && result.data != null) {
        emit(NewsDetailLoaded(result.data!));
      } else {
        emit(NewsError(result.message ?? 'Failed to fetch news detail'));
      }
    } catch (e) {
      emit(NewsError(e.toString()));
    }
  }
}
