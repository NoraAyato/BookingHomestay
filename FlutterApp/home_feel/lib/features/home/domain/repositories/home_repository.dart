import 'package:home_feel/features/home/data/models/homestay_tiennghi_response_model.dart';
import 'package:home_feel/core/models/api_response.dart';
import 'package:home_feel/features/home/data/models/homestay_detail_model.dart';
import 'package:home_feel/features/home/data/models/homestay_model.dart';
import 'package:home_feel/features/home/data/models/homestay_search_model.dart';
import 'package:home_feel/features/home/data/models/homestay_suggest_model.dart';
import 'package:home_feel/features/home/data/models/homestay_image_response_model.dart';

abstract class HomeRepository {
  Future<ApiResponse<HomestayTienNghiResponseModel>> getHomestayTienNghi(
    String id,
  );
  Future<ApiResponse<HomestayImageResponseModel>> getHomestayImages(String id);
  Future<ApiResponse<List<HomestayModel>>> fetchHomestays({
    String? location,
    String? filterType,
  });
  Future<List<HomestaySearchModel>> searchHomestaysByKeyword(String keyword);
  Future<List<HomestaySuggestModel>> suggestHomestays(String prefix);
  Future<ApiResponse<HomestayDetailModel>> getHomestayDetail(String id);
}
