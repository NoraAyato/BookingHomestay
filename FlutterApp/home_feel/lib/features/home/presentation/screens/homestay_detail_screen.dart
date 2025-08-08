import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/core/constants/api.dart';
import 'package:home_feel/features/home/presentation/bloc/home_bloc.dart';
import 'package:home_feel/features/home/presentation/bloc/home_event.dart';
import 'package:home_feel/features/home/presentation/bloc/home_state.dart';
import 'package:home_feel/features/home/data/models/homestay_detail_model.dart';
import 'package:home_feel/shared/presentation/widgets/app_dialog.dart';
import 'package:home_feel/features/home/presentation/screens/available_rooms_screen.dart';
import 'package:home_feel/shared/presentation/widgets/loading_overlay.dart';
import 'package:home_feel/shared/widgets/error_display.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class HomestayDetailScreen extends StatefulWidget {
  final String id;
  final DateTime? checkIn;
  final DateTime? checkOut;
  const HomestayDetailScreen({
    Key? key,
    required this.id,
    this.checkIn,
    this.checkOut,
  }) : super(key: key);

  @override
  State<HomestayDetailScreen> createState() => _HomestayDetailScreenState();
}

class _HomestayDetailScreenState extends State<HomestayDetailScreen> {
  late DateTime _checkIn;
  late DateTime _checkOut;
  int _currentImageIndex = 0;
  final PageController _pageController = PageController();

  String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }

  String _formatTime(DateTime date) {
    return '${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }

  String _formatCurrency(num value) {
    final str = value.toStringAsFixed(0);
    final buffer = StringBuffer();
    for (int i = 0; i < str.length; i++) {
      if (i > 0 && (str.length - i) % 3 == 0) buffer.write('.');
      buffer.write(str[i]);
    }
    return buffer.toString();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final now = DateTime.now();
    _checkIn = widget.checkIn ?? DateTime(now.year, now.month, now.day, 14, 0);
    _checkOut = widget.checkOut ?? _checkIn.add(const Duration(days: 1));
  }

  Future<void> _selectDateRange() async {
    final now = DateTime.now();
    final picked = await showDateRangePicker(
      context: context,
      initialDateRange: DateTimeRange(start: _checkIn, end: _checkOut),
      firstDate: DateTime(now.year, now.month, now.day),
      lastDate: DateTime(now.year, 12, 31),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.light(
              primary: Colors.orange,
              onPrimary: Colors.white,
              surface: Colors.white,
              onSurface: Colors.black,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      final days = picked.end.difference(picked.start).inDays;
      final isSameYear =
          picked.start.year == now.year && picked.end.year == now.year;
      if (days > 30) {
        // ignore: use_build_context_synchronously
        await showAppDialog(
          context: context,
          title: 'Lỗi',
          message: 'Bạn chỉ được chọn tối đa 30 ngày.',
          type: AppDialogType.warning,
          buttonText: 'Đóng',
        );
        return;
      }
      if (!isSameYear) {
        // ignore: use_build_context_synchronously
        await showAppDialog(
          context: context,
          title: 'Lỗi',
          message: 'Vui lòng chọn ngày trong năm hiện tại.',
          type: AppDialogType.warning,
          buttonText: 'Đóng',
        );
        return;
      }
      setState(() {
        _checkIn = DateTime(
          picked.start.year,
          picked.start.month,
          picked.start.day,
          14,
          0,
        );
        _checkOut = DateTime(
          picked.end.year,
          picked.end.month,
          picked.end.day,
          12,
          0,
        );
      });
    }
  }

  @override
  void initState() {
    super.initState();
    final bloc = BlocProvider.of<HomeBloc>(context, listen: false);
    bloc.add(GetHomestayDetailEvent(widget.id));
    bloc.add(GetHomestayImagesEvent(widget.id));
    bloc.add(GetHomestayTienNghiEvent(widget.id));
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        context.read<HomeBloc>().add(FetchHomestaysEvent());
        return true;
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Chi tiết Homestay'),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () {
              context.read<HomeBloc>().add(FetchHomestaysEvent());
              Navigator.of(context).pop();
            },
          ),
        ),
        body: Stack(
          children: [
            SingleChildScrollView(
              padding: const EdgeInsets.only(bottom: 120),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Images Section
                  BlocBuilder<HomeBloc, HomeState>(
                    buildWhen: (prev, curr) =>
                        curr is HomeImagesLoading ||
                        curr is HomeImagesLoaded ||
                        curr is HomeImagesError,
                    builder: (context, state) {
                      if (state is HomeImagesLoading) {
                        return const SizedBox(
                          height: 200,
                          child: Center(child: CircularProgressIndicator()),
                        );
                      } else if (state is HomeImagesLoaded) {
                        final List<String> images = [
                          state.images.mainImage,
                          ...state.images.roomImages,
                        ];

                        return Column(
                          children: [
                            SizedBox(
                              height: 250,
                              child: PageView.builder(
                                controller: _pageController,
                                itemCount: images.length,
                                onPageChanged: (index) {
                                  setState(() {
                                    _currentImageIndex = index;
                                  });
                                },
                                itemBuilder: (context, index) {
                                  return GestureDetector(
                                    onTap: () {
                                      showDialog(
                                        context: context,
                                        builder: (_) => Dialog(
                                          backgroundColor: Colors.transparent,
                                          child: GestureDetector(
                                            onTap: () =>
                                                Navigator.of(context).pop(),
                                            child: InteractiveViewer(
                                              child: Image.network(
                                                ApiConstants.baseUrl +
                                                    images[index],
                                                fit: BoxFit.contain,
                                              ),
                                            ),
                                          ),
                                        ),
                                      );
                                    },
                                    child: Container(
                                      width: MediaQuery.of(context).size.width,
                                      decoration: BoxDecoration(
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black.withOpacity(
                                              0.08,
                                            ),
                                            blurRadius: 8,
                                            offset: const Offset(0, 2),
                                          ),
                                        ],
                                      ),
                                      child: Image.network(
                                        ApiConstants.baseUrl + images[index],
                                        fit: BoxFit.cover,
                                        loadingBuilder:
                                            (context, child, progress) {
                                              if (progress == null)
                                                return child;
                                              return const Center(
                                                child:
                                                    CircularProgressIndicator(),
                                              );
                                            },
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                            const SizedBox(height: 8),
                            AnimatedSmoothIndicator(
                              activeIndex: _currentImageIndex,
                              count: images.length,
                              effect: WormEffect(
                                dotHeight: 8,
                                dotWidth: 8,
                                activeDotColor: Theme.of(context).primaryColor,
                                dotColor: Colors.grey.shade300,
                              ),
                            ),
                          ],
                        );
                      } else if (state is HomeImagesError) {
                        return ErrorDisplay(errorMessage: state.message);
                      }
                      return const SizedBox.shrink();
                    },
                  ),
                  const Divider(height: 24, thickness: 1),
                  // Detail Section
                  BlocBuilder<HomeBloc, HomeState>(
                    buildWhen: (prev, curr) =>
                        curr is HomeDetailLoading ||
                        curr is HomeDetailLoaded ||
                        curr is HomeDetailError,
                    builder: (context, state) {
                      if (state is HomeDetailLoading) {
                        return const Center(child: CircularProgressIndicator());
                      } else if (state is HomeDetailLoaded) {
                        final detail = state.detail;
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    detail.tenHomestay,
                                    style: const TextStyle(
                                      fontSize: 22,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      const Icon(
                                        Icons.location_on,
                                        color: Colors.orange,
                                        size: 18,
                                      ),
                                      const SizedBox(width: 4),
                                      Expanded(
                                        child: Text(
                                          detail.diaChi,
                                          style: const TextStyle(fontSize: 16),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      Icon(
                                        Icons.star,
                                        color: Colors.orange[400],
                                      ),
                                      Text(
                                        '${detail.diemHaiLongTrungBinh}',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      Text(' (${detail.tongDanhGia} đánh giá)'),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                            // Giới thiệu Section
                            const Divider(height: 24, thickness: 1),
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16.0,
                                vertical: 8,
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Giới thiệu',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    detail.gioiThieu.replaceAll('\\n', '\n'),
                                    style: const TextStyle(fontSize: 15),
                                  ),
                                ],
                              ),
                            ),
                            // Chính sách Section
                            const Divider(height: 24, thickness: 1),
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16.0,
                                vertical: 8,
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Chính sách',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  _buildChinhSach(detail.chinhSach),
                                ],
                              ),
                            ),
                          ],
                        );
                      } else if (state is HomeDetailError) {
                        return ErrorDisplay(errorMessage: state.message);
                      }
                      return const SizedBox.shrink();
                    },
                  ),
                  // Tiện nghi Section
                  const Divider(height: 24, thickness: 1),
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16.0,
                      vertical: 8,
                    ),
                    child: Text(
                      'Tiện ích homestay',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  BlocBuilder<HomeBloc, HomeState>(
                    buildWhen: (prev, curr) =>
                        curr is HomeTienNghiLoading ||
                        curr is HomeTienNghiLoaded ||
                        curr is HomeTienNghiError,
                    builder: (context, state) {
                      if (state is HomeTienNghiLoading) {
                        return const Center(child: CircularProgressIndicator());
                      } else if (state is HomeTienNghiLoaded) {
                        final tiennghi = state.tiennghi.tienNghis;
                        if (tiennghi.isEmpty) {
                          return const Padding(
                            padding: EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 8,
                            ),
                            child: Text(
                              'Hiện chưa có tiện nghi',
                              style: TextStyle(
                                color: Colors.grey,
                                fontSize: 14,
                              ),
                            ),
                          );
                        }
                        return SizedBox(
                          height: 60,
                          child: ListView.separated(
                            scrollDirection: Axis.horizontal,
                            itemCount: tiennghi.length,
                            separatorBuilder: (context, index) =>
                                const SizedBox(width: 10),
                            itemBuilder: (context, index) {
                              return Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 2,
                                ),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    CircleAvatar(
                                      radius: 15,
                                      backgroundColor: Colors.grey[200],
                                      child: Icon(
                                        Icons.check,
                                        color: Colors.blue,
                                        size: 16,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    SizedBox(
                                      width: 38,
                                      child: Text(
                                        tiennghi[index].tenTienNghi,
                                        style: const TextStyle(fontSize: 10),
                                        textAlign: TextAlign.center,
                                        overflow: TextOverflow.ellipsis,
                                        maxLines: 2,
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        );
                      } else if (state is HomeTienNghiError) {
                        return ErrorDisplay(errorMessage: state.message);
                      }
                      return const SizedBox.shrink();
                    },
                  ),
                  const SizedBox(height: 24),
                  // ... add more sections as needed ...
                ],
              ),
            ),
            // Date range and booking bar (fixed at bottom)
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: Container(
                color: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                child: BlocBuilder<HomeBloc, HomeState>(
                  buildWhen: (prev, curr) =>
                      curr is HomeDetailLoaded || curr is HomeDetailError,
                  builder: (context, state) {
                    if (state is! HomeDetailLoaded)
                      return const SizedBox.shrink();
                    final detail = state.detail;
                    final price = detail.giaTien;
                    final soNgay = _checkOut.difference(_checkIn).inDays;
                    final nhanPhong = detail.chinhSach.nhanPhong;
                    final traPhong = detail.chinhSach.traPhong;
                    final total = price * soNgay;
                    return Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        GestureDetector(
                          onTap: _selectDateRange,
                          child: Container(
                            width: double.infinity,
                            decoration: BoxDecoration(
                              color: Colors.blue[50],
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(
                                color: Colors.blue[100]!,
                                width: 1,
                              ),
                            ),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 16,
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                const Icon(
                                  Icons.apartment,
                                  color: Colors.orange,
                                  size: 20,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  soNgay == 1 ? '01 ngày' : '$soNgay ngày',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  '|',
                                  style: TextStyle(
                                    color: Colors.grey[600],
                                    fontSize: 11,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Flexible(
                                  child: Text(
                                    '${_formatTime(_checkIn)} | ${_formatDate(_checkIn)}',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w500,
                                      fontSize: 11,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                const Icon(
                                  Icons.arrow_right_alt,
                                  size: 16,
                                  color: Colors.grey,
                                ),
                                Flexible(
                                  child: Text(
                                    '${_formatTime(_checkOut)} | ${_formatDate(_checkOut)}',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w500,
                                      fontSize: 11,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    const Text(
                                      'Tổng cộng ',
                                      style: TextStyle(fontSize: 15),
                                    ),
                                    if (price > 0 && soNgay > 0)
                                      Text(
                                        '${_formatCurrency(total)}đ',
                                        style: const TextStyle(
                                          fontSize: 22,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.black,
                                        ),
                                      ),
                                  ],
                                ),
                                Row(
                                  children: [
                                    Text(
                                      'Nhận phòng: $nhanPhong',
                                      style: const TextStyle(
                                        fontSize: 11,
                                        color: Colors.grey,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      'Trả phòng: $traPhong',
                                      style: const TextStyle(
                                        fontSize: 11,
                                        color: Colors.grey,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.orange,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 18,
                                  vertical: 10,
                                ),
                                minimumSize: const Size(0, 36),
                              ),
                              onPressed: () {
                                // Lấy detail từ biến state truyền vào BlocBuilder
                                final detail = state.detail;
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (context) => AvailableRoomsScreen(
                                      homestayId: widget.id,
                                      checkIn: _checkIn,
                                      checkOut: _checkOut,
                                      checkInTime: detail.chinhSach.nhanPhong,
                                      checkOutTime: detail.chinhSach.traPhong,
                                    ),
                                  ),
                                );
                              },
                              child: const Text(
                                'Chọn phòng',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChinhSach(ChinhSachModel chinhSach) {
    // Nếu tất cả trường đều rỗng hoặc null thì trả về thông báo
    final isEmpty =
        chinhSach.nhanPhong.isEmpty &&
        chinhSach.traPhong.isEmpty &&
        chinhSach.huyPhong.isEmpty &&
        chinhSach.buaAn.isEmpty;
    if (isEmpty) {
      return const Padding(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Text(
          'Hiện chưa có chính sách',
          style: TextStyle(color: Colors.grey, fontSize: 14),
        ),
      );
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (chinhSach.nhanPhong.isNotEmpty)
          Row(
            children: [
              const Icon(Icons.login, size: 18, color: Colors.orange),
              const SizedBox(width: 8),
              Text('Nhận phòng: ${chinhSach.nhanPhong}'),
            ],
          ),
        if (chinhSach.nhanPhong.isNotEmpty) const SizedBox(height: 4),
        if (chinhSach.traPhong.isNotEmpty)
          Row(
            children: [
              const Icon(Icons.logout, size: 18, color: Colors.orange),
              const SizedBox(width: 8),
              Text('Trả phòng: ${chinhSach.traPhong}'),
            ],
          ),
        if (chinhSach.traPhong.isNotEmpty) const SizedBox(height: 4),
        if (chinhSach.huyPhong.isNotEmpty)
          Row(
            children: [
              const Icon(Icons.cancel, size: 18, color: Colors.orange),
              const SizedBox(width: 8),
              Text('Hủy phòng: ${chinhSach.huyPhong}'),
            ],
          ),
        if (chinhSach.huyPhong.isNotEmpty) const SizedBox(height: 4),
        if (chinhSach.buaAn.isNotEmpty)
          Row(
            children: [
              const Icon(Icons.restaurant, size: 18, color: Colors.orange),
              const SizedBox(width: 8),
              Text('Bữa ăn: ${chinhSach.buaAn}'),
            ],
          ),
      ],
    );
  }
}
