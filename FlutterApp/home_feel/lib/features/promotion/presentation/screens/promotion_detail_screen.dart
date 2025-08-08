import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/core/constants/api.dart';
import 'package:home_feel/core/services/service_locator.dart';
import 'package:home_feel/features/promotion/data/models/promotion_model.dart';
import 'package:home_feel/features/promotion/presentation/bloc/promotion_bloc.dart';
import 'package:home_feel/features/promotion/presentation/bloc/promotion_event.dart';
import 'package:home_feel/features/promotion/presentation/bloc/promotion_state.dart';
import 'package:home_feel/shared/widgets/error_display.dart';
import 'package:intl/intl.dart';

class PromotionDetailScreen extends StatelessWidget {
  final String maKM;

  const PromotionDetailScreen({super.key, required this.maKM});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          sl<PromotionBloc>()..add(GetKhuyenMaiByIdEvent(maKM)),
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios),
            onPressed: () => Navigator.pop(context),
          ),
          title: const Text('Chi tiết khuyến mãi'),
          backgroundColor: Colors.white,
          elevation: 0,
        ),
        body: BlocBuilder<PromotionBloc, PromotionState>(
          builder: (context, state) {
            if (state is PromotionLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is PromotionLoaded) {
              return _buildPromotionDetail(context, state.promotion);
            } else if (state is PromotionError) {
              return ErrorDisplay(errorMessage: state.message);
            }
            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }

  Widget _buildPromotionDetail(BuildContext context, PromotionModel promotion) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (promotion.hinhAnh != null)
            Image.network(
              ApiConstants.baseUrl + promotion.hinhAnh!,
              width: double.infinity,
              height: 200,
              fit: BoxFit.cover,
            ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  promotion.noiDung,
                  style: Theme.of(
                    context,
                  ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                _buildInfoRow(
                  'Mã khuyến mãi:',
                  promotion.maKM,
                  Icons.confirmation_number_outlined,
                ),
                const SizedBox(height: 12),
                _buildInfoRow(
                  'Giảm giá:',
                  promotion.loaiChietKhau == 'fixed'
                      ? '${(promotion.chietKhau * 1000).toInt()}đ'
                      : '${promotion.chietKhau}%',
                  Icons.local_offer_outlined,
                ),
                const SizedBox(height: 12),
                _buildInfoRow(
                  'Số lượng:',
                  promotion.soLuong != null
                      ? '${promotion.soLuong} lượt'
                      : 'Không giới hạn',
                  Icons.card_giftcard_outlined,
                ),
                const SizedBox(height: 12),
                _buildInfoRow(
                  'Thời gian:',
                  '${DateFormat('dd/MM/yyyy').format(promotion.ngayBatDau)} - ${DateFormat('dd/MM/yyyy').format(promotion.ngayKetThuc)}',
                  Icons.date_range_outlined,
                ),
                const SizedBox(height: 24),
                const Text(
                  'Điều kiện áp dụng',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                _buildConditionItem(
                  'Số đêm tối thiểu:',
                  promotion.soDemToiThieu != null
                      ? '${promotion.soDemToiThieu} đêm'
                      : 'Không yêu cầu',
                ),
                _buildConditionItem(
                  'Đặt trước:',
                  promotion.soNgayDatTruoc != null
                      ? '${promotion.soNgayDatTruoc} ngày'
                      : 'Không yêu cầu',
                ),
                _buildConditionItem(
                  'Áp dụng cho:',
                  promotion.chiApDungChoKhachMoi
                      ? 'Khách mới'
                      : 'Tất cả khách hàng',
                ),
                _buildConditionItem(
                  'Phạm vi áp dụng:',
                  promotion.apDungChoTatCaPhong
                      ? 'Tất cả phòng'
                      : 'Một số phòng',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Colors.grey[600]),
        const SizedBox(width: 8),
        Text(
          '$label ',
          style: const TextStyle(color: Colors.grey, fontSize: 16),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
          ),
        ),
      ],
    );
  }

  Widget _buildConditionItem(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.check_circle_outline, size: 20, color: Colors.green),
          const SizedBox(width: 8),
          Expanded(
            child: RichText(
              text: TextSpan(
                style: const TextStyle(fontSize: 15, color: Colors.black87),
                children: [
                  TextSpan(
                    text: '$label ',
                    style: const TextStyle(color: Colors.grey),
                  ),
                  TextSpan(text: value),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
