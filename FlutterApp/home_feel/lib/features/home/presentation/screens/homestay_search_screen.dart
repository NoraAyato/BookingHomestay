import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/shared/presentation/widgets/app_dialog.dart';
import 'package:intl/intl.dart';
import 'package:home_feel/features/home/presentation/bloc/home_bloc.dart';
import 'package:home_feel/features/home/presentation/bloc/home_event.dart';
import 'package:home_feel/features/home/presentation/bloc/home_state.dart';
import 'package:home_feel/features/home/data/models/homestay_suggest_model.dart';
import 'package:home_feel/features/home/presentation/screens/homestay_detail_screen.dart';

class HomestaySearchScreen extends StatefulWidget {
  const HomestaySearchScreen({super.key});

  @override
  State<HomestaySearchScreen> createState() => _HomestaySearchScreenState();
}

class _HomestaySearchScreenState extends State<HomestaySearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  DateTime? _checkInDate;
  DateTime? _checkOutDate;

  @override
  void initState() {
    super.initState();
    _searchController.addListener(_onSearchChanged);
  }

  void _onSearchChanged() {
    final value = _searchController.text.trim();
    if (value.isNotEmpty) {
      context.read<HomeBloc>().add(SuggestHomestaysEvent(value));
    }
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch() {
    final keyword = _searchController.text.trim();
    if (keyword.isNotEmpty) {
      context.read<HomeBloc>().add(SearchHomestaysEvent(keyword));
    }
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        // Khi back vật lý, phát event reload cho HomeBloc
        context.read<HomeBloc>().add(FetchHomestaysEvent());
        return true;
      },
      child: BlocListener<HomeBloc, HomeState>(
        listenWhen: (prev, curr) => curr is HomeSearchLoaded,
        listener: (context, state) {
          if (state is HomeSearchLoaded && state.results.isNotEmpty) {
            final first = state.results.first;
            final id = first.id.toString();
            if (id.isNotEmpty) {
              Navigator.of(context).push(
                PageRouteBuilder(
                  pageBuilder: (context, animation, secondaryAnimation) =>
                      HomestayDetailScreen(
                        id: id,
                        checkIn: _checkInDate,
                        checkOut: _checkOutDate,
                      ),
                  transitionsBuilder:
                      (context, animation, secondaryAnimation, child) {
                        const begin = Offset(1.0, 0.0);
                        const end = Offset.zero;
                        const curve = Curves.ease;
                        final tween = Tween(
                          begin: begin,
                          end: end,
                        ).chain(CurveTween(curve: curve));
                        return SlideTransition(
                          position: animation.drive(tween),
                          child: child,
                        );
                      },
                ),
              );
            }
          }
        },
        child: Scaffold(
          resizeToAvoidBottomInset: false,
          body: MediaQuery.removePadding(
            context: context,
            removeBottom: true,
            child: Column(
              children: [
                // Phần tìm kiếm cố định, không cuộn
                Container(
                  height: 200,
                  decoration: BoxDecoration(
                    color: Colors.orange[100],
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.2),
                        spreadRadius: 1,
                        blurRadius: 2,
                        offset: const Offset(0, 1),
                      ),
                    ],
                  ),
                  child: SafeArea(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.fromLTRB(4, 8, 4, 0),
                          child: Row(
                            children: [
                              IconButton(
                                icon: const Icon(
                                  Icons.arrow_back_ios,
                                  size: 18,
                                ),
                                padding: EdgeInsets.zero,
                                onPressed: () {
                                  Navigator.pop(context);
                                  // Sau khi pop, phát event reload cho HomeBloc
                                  context.read<HomeBloc>().add(
                                    FetchHomestaysEvent(),
                                  );
                                },
                              ),
                              const Expanded(
                                child: Text(
                                  'Tìm Kiếm Homestay',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black87,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 40),
                            ],
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              SizedBox(
                                height: 36,
                                child: TextField(
                                  controller: _searchController,
                                  autofocus: true,
                                  style: const TextStyle(fontSize: 13),
                                  decoration: InputDecoration(
                                    hintText: 'Tên khách sạn, huyện/quận',
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(25.0),
                                      borderSide: BorderSide.none,
                                    ),
                                    filled: true,
                                    fillColor: Colors.white,
                                    prefixIcon: const Icon(
                                      Icons.search,
                                      color: Colors.orange,
                                      size: 14.0,
                                    ),
                                    contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 8.0,
                                      vertical: 0.0,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  Flexible(
                                    child: SizedBox(
                                      height: 36,
                                      child: InkWell(
                                        onTap: () async {
                                          final date = await showDatePicker(
                                            context: context,
                                            initialDate: DateTime.now(),
                                            firstDate: DateTime.now(),
                                            lastDate: DateTime.now().add(
                                              const Duration(days: 365),
                                            ),
                                          );
                                          if (date != null) {
                                            setState(() {
                                              _checkInDate = date;
                                            });
                                          }
                                        },
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(
                                            vertical: 8,
                                            horizontal: 12,
                                          ),
                                          decoration: BoxDecoration(
                                            color: Colors.white,
                                            borderRadius: BorderRadius.circular(
                                              8,
                                            ),
                                          ),
                                          child: Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            children: [
                                              const Icon(
                                                Icons.calendar_today,
                                                size: 16,
                                                color: Colors.orange,
                                              ),
                                              const SizedBox(width: 8),
                                              Text(
                                                _checkInDate != null
                                                    ? DateFormat(
                                                        'dd/MM/yyyy',
                                                      ).format(_checkInDate!)
                                                    : 'Nhận phòng',
                                                style: const TextStyle(
                                                  fontSize: 13,
                                                ),
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 20),
                                  Flexible(
                                    child: SizedBox(
                                      height: 36,
                                      child: InkWell(
                                        onTap: () async {
                                          if (_checkInDate == null) {
                                            await showAppDialog(
                                              context: context,
                                              title: 'Thông báo',
                                              message:
                                                  'Vui lòng chọn ngày nhận phòng trước',
                                              type: AppDialogType.warning,
                                              buttonText: 'Đóng',
                                            );
                                            return;
                                          }
                                          final date = await showDatePicker(
                                            context: context,
                                            initialDate: _checkInDate!.add(
                                              const Duration(days: 1),
                                            ),
                                            firstDate: _checkInDate!.add(
                                              const Duration(days: 1),
                                            ),
                                            lastDate: _checkInDate!.add(
                                              const Duration(days: 30),
                                            ),
                                          );
                                          if (date != null) {
                                            setState(() {
                                              _checkOutDate = date;
                                            });
                                          }
                                        },
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(
                                            vertical: 8,
                                            horizontal: 12,
                                          ),
                                          decoration: BoxDecoration(
                                            color: Colors.white,
                                            borderRadius: BorderRadius.circular(
                                              8,
                                            ),
                                          ),
                                          child: Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            children: [
                                              const Icon(
                                                Icons.calendar_today,
                                                size: 16,
                                                color: Colors.orange,
                                              ),
                                              const SizedBox(width: 8),
                                              Text(
                                                _checkOutDate != null
                                                    ? DateFormat(
                                                        'dd/MM/yyyy',
                                                      ).format(_checkOutDate!)
                                                    : 'Trả phòng',
                                                style: const TextStyle(
                                                  fontSize: 13,
                                                ),
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                // Phần danh sách gợi ý và kết quả cho phép cuộn
                Expanded(
                  child: ListView(
                    padding: EdgeInsets.zero,
                    children: [
                      BlocBuilder<HomeBloc, HomeState>(
                        builder: (context, state) {
                          if (state is HomeSuggestLoaded &&
                              state.suggestions.isNotEmpty) {
                            return Container(
                              color: Colors.white,
                              padding: const EdgeInsets.symmetric(
                                vertical: 8,
                                horizontal: 0,
                              ),
                              child: ListView.separated(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount: state.suggestions.length,
                                separatorBuilder: (_, __) => const Divider(
                                  height: 1,
                                  thickness: 1,
                                  indent: 16,
                                  endIndent: 16,
                                ),
                                itemBuilder: (context, index) {
                                  final HomestaySuggestModel item =
                                      state.suggestions[index];
                                  return InkWell(
                                    onTap: () {
                                      _searchController.text = item.tenHomestay;
                                    },
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(
                                        vertical: 10,
                                        horizontal: 16,
                                      ),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              const Icon(
                                                Icons.apartment,
                                                size: 22,
                                                color: Colors.black38,
                                              ),
                                              const SizedBox(width: 10),
                                              Expanded(
                                                child: Text(
                                                  item.tenHomestay,
                                                  style: const TextStyle(
                                                    fontWeight: FontWeight.w600,
                                                    fontSize: 15,
                                                    color: Colors.black87,
                                                  ),
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 4),
                                          Row(
                                            children: [
                                              const Icon(
                                                Icons.location_on_outlined,
                                                size: 20,
                                                color: Colors.black26,
                                              ),
                                              const SizedBox(width: 10),
                                              Expanded(
                                                child: Text(
                                                  item.diaChi,
                                                  style: const TextStyle(
                                                    fontSize: 14,
                                                    color: Colors.black54,
                                                  ),
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 4),
                                          Row(
                                            children: [
                                              const Icon(
                                                Icons.map_outlined,
                                                size: 18,
                                                color: Colors.black26,
                                              ),
                                              const SizedBox(width: 10),
                                              Expanded(
                                                child: Text(
                                                  item.khuVuc,
                                                  style: const TextStyle(
                                                    fontSize: 13,
                                                    color: Colors.black45,
                                                  ),
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                            );
                          }
                          return const SizedBox.shrink();
                        },
                      ),
                      // Kết quả tìm kiếm (nếu có) - giữ nguyên placeholder
                      SizedBox(
                        height: MediaQuery.of(context).size.height - 200,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: 0,
                          itemBuilder: (context, index) {
                            return const SizedBox();
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          floatingActionButton: FloatingActionButton.extended(
            onPressed: _onSearch,
            backgroundColor: Colors.orange,
            label: const Text('Tìm kiếm'),
            icon: const Icon(Icons.search),
          ),
        ),
      ),
    );
  }
}
