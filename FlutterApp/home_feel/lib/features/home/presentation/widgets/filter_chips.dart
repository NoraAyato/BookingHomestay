import 'package:flutter/material.dart';

class FilterChips extends StatelessWidget {
  final Function(String) onFilterSelected;

  const FilterChips({super.key, required this.onFilterSelected});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children:
            [
                  FilterChip(
                    label: const Text('Giảm Tới 25%'),
                    selected: false,
                    onSelected: (_) => onFilterSelected('discount'),
                  ),
                  FilterChip(
                    label: const Text('Top Review'),
                    selected: false,
                    onSelected: (_) => onFilterSelected('top_review'),
                  ),
                  FilterChip(
                    label: const Text('Phòng Phim'),
                    selected: false,
                    onSelected: (_) => onFilterSelected('movie_room'),
                  ),
                  FilterChip(
                    label: const Text('Thịnh Hành'),
                    selected: false,
                    onSelected: (_) => onFilterSelected('popular'),
                  ),
                  FilterChip(
                    label: const Text('Phòng E Nhất Từ'),
                    selected: false,
                    onSelected: (_) => onFilterSelected('best_deal'),
                  ),
                ]
                .map(
                  (chip) =>
                      Padding(padding: const EdgeInsets.all(4.0), child: chip),
                )
                .toList(),
      ),
    );
  }
}
