import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/usecases/get_all_news_use_case.dart';
import '../../domain/repositories/usecases/get_news_detail_use_case.dart';
import 'news_event.dart';
import 'news_state.dart';

class NewsBloc extends Bloc<NewsEvent, NewsState> {
  final GetAllNewsUseCase _getAllNewsUseCase;
  final GetNewsDetailUseCase _getNewsDetailUseCase;
  bool _hasLoadedNews = false; // Theo dõi xem đã tải tin tức chưa

  NewsBloc(this._getAllNewsUseCase, this._getNewsDetailUseCase)
    : super(NewsInitial()) {
    on<GetAllNewsEvent>(_onGetAllNews);
    on<GetNewsDetailEvent>(_onGetNewsDetail);
  }

  Future<void> _onGetAllNews(
    GetAllNewsEvent event,
    Emitter<NewsState> emit,
  ) async {
    // Nếu không phải là refresh và đã có dữ liệu, giữ nguyên trạng thái hiện tại
    if (!event.refresh && state is NewsLoaded) {
      return;
    }

    print('GetAllNewsEvent received');
    emit(NewsLoading());
    try {
      final result = await _getAllNewsUseCase();
      print('GetAllNewsUseCase result: $result');
      if (result.success && result.data != null) {
        print('News loaded successfully: ${result.data!.length} items');
        emit(NewsLoaded(result.data!));
        _hasLoadedNews = true;
      } else {
        print('Failed to load news: ${result.message}');
        emit(NewsError(result.message));
      }
    } catch (e, stackTrace) {
      print('Error loading news: $e');
      print('Stack trace: $stackTrace');

      // Nếu đã tải dữ liệu trước đó và gặp lỗi kết nối, giữ trạng thái hiện tại
      if (_hasLoadedNews &&
          state is NewsLoaded &&
          e.toString().contains("SocketException")) {
        // Không phát ra lỗi, giữ dữ liệu hiện tại
        return;
      }

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
        emit(NewsError(result.message));
      }
    } catch (e) {
      // Nếu gặp lỗi kết nối, không phát ra lỗi nếu đã có dữ liệu chi tiết
      if (state is NewsDetailLoaded &&
          e.toString().contains("SocketException")) {
        return;
      }
      emit(NewsError(e.toString()));
    }
  }
}
