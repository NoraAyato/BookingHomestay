import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/features/home/presentation/screens/homestay_detail_screen.dart';
import 'package:home_feel/shared/widgets/error_display.dart';
import '../bloc/home_bloc.dart';
import '../bloc/home_event.dart';
import '../bloc/home_state.dart';
import 'homestay_card.dart';

class HomestayList extends StatelessWidget {
  const HomestayList({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        if (state is HomeLoading) {
          return const Center(child: CircularProgressIndicator());
        } else if (state is HomeLoaded) {
          return SizedBox(
            height: 220,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              itemCount: state.homestays.length,
              itemBuilder: (context, index) {
                final homestay = state.homestays[index];
                return Padding(
                  padding: const EdgeInsets.only(right: 12.0),
                  child: SizedBox(
                    width: 250,
                    child: InkWell(
                      borderRadius: BorderRadius.circular(16),
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => HomestayDetailScreen(
                              id: homestay.id.toString(),
                            ),
                          ),
                        );
                      },
                      child: HomestayCard(homestay: homestay),
                    ),
                  ),
                );
              },
            ),
          );
        } else if (state is HomeError) {
          return ErrorDisplay(errorMessage: state.message);
        }
        return const Center(child: Text('Đang tải dữ liệu...'));
      },
    );
  }
}
