import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/features/promotion/data/models/promotion_model.dart';
import 'package:home_feel/features/promotion/presentation/bloc/promotion_bloc.dart';
import 'package:home_feel/features/promotion/presentation/bloc/promotion_event.dart';
import 'package:home_feel/features/promotion/presentation/bloc/promotion_state.dart';
import 'package:intl/intl.dart';

class AvailablePromotionsScreen extends StatefulWidget {
  final String maPDPhong;
  final DateTime ngayDen;
  final DateTime ngayDi;

  const AvailablePromotionsScreen({
    Key? key,
    required this.maPDPhong,
    required this.ngayDen,
    required this.ngayDi,
  }) : super(key: key);

  @override
  State<AvailablePromotionsScreen> createState() =>
      _AvailablePromotionsScreenState();
}

class _AvailablePromotionsScreenState extends State<AvailablePromotionsScreen> {
  // Selected promotion id
  String? _selectedPromotionId;

  @override
  void initState() {
    super.initState();
    _loadPromotions();
  }

  void _loadPromotions() {
    context.read<PromotionBloc>().add(
      GetMyPromotionEvent(
        maPDPhong: widget.maPDPhong,
        ngayDen: widget.ngayDen,
        ngayDi: widget.ngayDi,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Chọn ưu đãi',
          style: TextStyle(color: Colors.black87, fontWeight: FontWeight.w600),
        ),
        actions: [
          TextButton(
            onPressed: () {
              // Trả về null nếu không chọn ưu đãi nào
              Navigator.of(context).pop(null);
            },
            child: Text(
              'Đổi thưởng',
              style: TextStyle(
                color: Colors.orange,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black87),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: BlocBuilder<PromotionBloc, PromotionState>(
        builder: (context, state) {
          if (state is PromotionLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is MyPromotionsLoaded) {
            final promotions = state.promotions;

            if (promotions.isEmpty) {
              return _buildNoPromotionsAvailable();
            }

            return _buildPromotionsList(promotions);
          } else if (state is PromotionError) {
            return Center(
              child: Text(
                'Lỗi: ${state.message}',
                style: const TextStyle(color: Colors.red),
              ),
            );
          }

          return const Center(child: CircularProgressIndicator());
        },
      ),
      bottomNavigationBar: _buildBottomBar(),
    );
  }

  Widget _buildNoPromotionsAvailable() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.card_giftcard, size: 80, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          Text(
            'Không có ưu đãi nào khả dụng',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: Colors.grey.shade700,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Hiện không có ưu đãi nào cho phòng này và thời gian bạn chọn',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
          ),
        ],
      ),
    );
  }

  Widget _buildPromotionsList(List<PromotionModel> promotions) {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      itemCount: promotions.length,
      itemBuilder: (context, index) {
        final promotion = promotions[index];
        final isSelected = _selectedPromotionId == promotion.maKM;
        return _buildPromotionCard(promotion, isSelected);
      },
    );
  }

  Widget _buildPromotionCard(PromotionModel promotion, bool isSelected) {
    // Calculate discount value for display
    final discountValue = promotion.loaiChietKhau == 'percentage'
        ? '${promotion.chietKhau.toInt()}%'
        : NumberFormat.currency(
            locale: 'vi_VN',
            symbol: 'đ',
          ).format(promotion.chietKhau * 1000).replaceAll('.', ',');

    // Format dates
    final startDate = DateFormat('dd/MM/yyyy').format(promotion.ngayBatDau);
    final endDate = DateFormat('dd/MM/yyyy').format(promotion.ngayKetThuc);

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedPromotionId = promotion.maKM;
        });
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? Colors.orange.shade400 : Colors.grey.shade200,
            width: isSelected ? 2 : 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              spreadRadius: 1,
              blurRadius: 3,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        child: Stack(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (promotion.hinhAnh != null && promotion.hinhAnh!.isNotEmpty)
                  ClipRRect(
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(12),
                      topRight: Radius.circular(12),
                    ),
                    child: Image.network(
                      promotion.hinhAnh!,
                      height: 80,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          height: 80,
                          color: Colors.orange.shade50,
                          child: Center(
                            child: Icon(
                              Icons.card_giftcard,
                              color: Colors.orange,
                              size: 40,
                            ),
                          ),
                        );
                      },
                    ),
                  )
                else
                  Container(
                    height: 80,
                    decoration: BoxDecoration(
                      color: Colors.orange.shade50,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(11),
                        topRight: Radius.circular(11),
                      ),
                    ),
                    child: Center(
                      child: promotion.loaiChietKhau == 'percentage'
                          ? Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  '${promotion.chietKhau.toInt()}%',
                                  style: TextStyle(
                                    fontSize: 32,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.orange.shade700,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  'GIẢM',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.orange.shade700,
                                  ),
                                ),
                              ],
                            )
                          : Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'GIẢM',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.orange.shade700,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  '${NumberFormat.compact(locale: 'vi').format(promotion.chietKhau * 1000)}đ',
                                  style: TextStyle(
                                    fontSize: 32,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.orange.shade700,
                                  ),
                                ),
                              ],
                            ),
                    ),
                  ),

                // Promotion details
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        promotion.noiDung,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Giảm $discountValue${promotion.loaiChietKhau == "percentage" ? " tối đa ${NumberFormat.compact(locale: 'vi').format(20000)}đ" : ""} (áp dụng cho tiền phòng)',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                          color: Colors.orange.shade700,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(
                            Icons.calendar_today_outlined,
                            size: 14,
                            color: Colors.grey.shade600,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'HSD: $startDate - $endDate',
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Áp dụng cho tất cả các hình thức thanh toán.',
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey.shade600,
                        ),
                      ),
                      if (promotion.soLuong != null && promotion.soLuong! < 5)
                        Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: Text(
                            'Số lượt còn lại: ${promotion.soLuong!.toInt()}',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                              color: Colors.red.shade700,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),

            // Radio button
            Positioned(
              top: 16,
              right: 16,
              child: Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isSelected
                        ? Colors.orange.shade400
                        : Colors.grey.shade400,
                    width: 2,
                  ),
                  color: isSelected ? Colors.orange.shade400 : Colors.white,
                ),
                child: isSelected
                    ? Icon(Icons.check, size: 16, color: Colors.white)
                    : null,
              ),
            ),

            // Hết lượt sử dụng
            if (promotion.soLuong != null && promotion.soLuong == 0)
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.8),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.error_outline,
                        color: Colors.red.shade400,
                        size: 32,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Số lượt sử dụng ưu đãi này đã hết.',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.red.shade700,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomBar() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.2),
            spreadRadius: 1,
            blurRadius: 5,
            offset: const Offset(0, -1),
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: _selectedPromotionId != null
            ? () {
                // Return selected promotion to previous screen
                final state = context.read<PromotionBloc>().state;
                if (state is MyPromotionsLoaded) {
                  final selectedPromotion = state.promotions.firstWhere(
                    (promo) => promo.maKM == _selectedPromotionId,
                  );
                  Navigator.of(context).pop(selectedPromotion);
                }
              }
            : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.orange,
          disabledBackgroundColor: Colors.grey.shade300,
          padding: const EdgeInsets.symmetric(vertical: 12),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
        child: const Text(
          'Xác nhận',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}
