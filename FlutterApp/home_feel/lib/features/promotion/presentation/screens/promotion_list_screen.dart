import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/core/services/service_locator.dart';
import 'package:home_feel/features/promotion/presentation/bloc/promotion_bloc.dart';
import 'package:home_feel/features/promotion/presentation/bloc/promotion_event.dart';
import 'package:home_feel/features/promotion/presentation/bloc/promotion_state.dart';
import 'package:home_feel/features/promotion/presentation/widgets/promotion_item.dart';
import 'package:home_feel/shared/widgets/error_display.dart';

class PromotionListScreen extends StatefulWidget {
  final bool showAll;

  const PromotionListScreen({super.key, this.showAll = false});

  @override
  State<PromotionListScreen> createState() => _PromotionListScreenState();
}

class _PromotionListScreenState extends State<PromotionListScreen> {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => sl<PromotionBloc>()..add(GetAdminKhuyenMaiEvent()),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Chương trình khuyến mãi'),
          backgroundColor: Colors.white,
          elevation: 0,
        ),
        body: BlocBuilder<PromotionBloc, PromotionState>(
          builder: (context, state) {
            if (state is PromotionLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is PromotionsLoaded) {
              final promotions = widget.showAll
                  ? state.promotions
                  : state.promotions.take(4).toList();

              return Column(
                children: [
                  Expanded(
                    child: ListView.builder(
                      itemCount: promotions.length,
                      itemBuilder: (context, index) {
                        return PromotionItem(
                          promotion: promotions[index],
                          onTap: () {
                            // TODO: Navigate to promotion detail
                          },
                        );
                      },
                    ),
                  ),
                  if (!widget.showAll && state.promotions.length > 4)
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (_) =>
                                    const PromotionListScreen(showAll: true),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            backgroundColor: Colors.deepOrange,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: const Text('Xem tất cả'),
                        ),
                      ),
                    ),
                ],
              );
            } else if (state is PromotionError) {
              return ErrorDisplay(errorMessage: state.message);
            }
            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }
}
