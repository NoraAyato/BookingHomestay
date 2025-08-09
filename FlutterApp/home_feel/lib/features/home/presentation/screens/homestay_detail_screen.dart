import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/core/constants/api.dart';
import 'package:home_feel/features/home/presentation/bloc/home_bloc.dart';
import 'package:home_feel/features/home/presentation/bloc/home_event.dart';
import 'package:home_feel/features/home/presentation/bloc/home_state.dart';
import 'package:home_feel/features/home/data/models/homestay_detail_model.dart';
import 'package:home_feel/shared/presentation/widgets/app_dialog.dart';
import 'package:home_feel/features/home/presentation/screens/available_rooms_screen.dart';
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

  // Phương thức hiển thị một hình ảnh
  Widget _buildSingleImage(String imageUrl, double width, double height) {
    return Image.network(
      ApiConstants.baseUrl + imageUrl,
      width: width,
      height: height,
      fit: BoxFit.cover,
      loadingBuilder: (context, child, progress) {
        if (progress == null) return child;
        return const Center(
          child: CircularProgressIndicator(
            color: Colors.orange,
            strokeWidth: 3,
          ),
        );
      },
    );
  }

  // Phương thức hiển thị lưới hình ảnh
  Widget _buildImageGrid(List<String> images, double width, double height) {
    // Số hình ảnh hiển thị tối đa là 3 (1 lớn, 2 nhỏ)
    final int maxVisible = 3;
    final int remainingCount = images.length > maxVisible
        ? images.length - maxVisible
        : 0;

    return Stack(
      children: [
        Row(
          children: [
            // Cột bên trái chiếm 60% chiều rộng - hình ảnh chính
            Expanded(
              flex: 3,
              child: Container(
                height: height,
                child: ClipRRect(
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(16),
                    bottomLeft: Radius.circular(16),
                  ),
                  child: _buildSingleImage(images[0], width * 0.6, height),
                ),
              ),
            ),
            const SizedBox(width: 2),
            // Cột bên phải chiếm 40% chiều rộng - 2 hình nhỏ
            Expanded(
              flex: 2,
              child: Column(
                children: [
                  // Hình trên cùng bên phải
                  Container(
                    height: height / 2 - 1,
                    child: ClipRRect(
                      borderRadius: BorderRadius.only(
                        topRight: Radius.circular(16),
                      ),
                      child: _buildSingleImage(
                        images.length > 1 ? images[1] : images[0],
                        width * 0.4,
                        height / 2,
                      ),
                    ),
                  ),
                  const SizedBox(height: 2),
                  // Hình dưới bên phải
                  Container(
                    height: height / 2 - 1,
                    child: ClipRRect(
                      borderRadius: BorderRadius.only(
                        bottomRight: Radius.circular(16),
                      ),
                      child: _buildSingleImage(
                        images.length > 2 ? images[2] : images[0],
                        width * 0.4,
                        height / 2,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        // Hiển thị nút "Xem thêm" nếu có nhiều hình
        if (remainingCount > 0)
          Positioned(
            bottom: 10,
            right: 10,
            child: GestureDetector(
              onTap: () => _showFullGallery(context, images),
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.7),
                  borderRadius: BorderRadius.circular(17),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.photo_library_outlined,
                      color: Colors.white,
                      size: 16,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      "+${remainingCount}",
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }

  // Phương thức hiển thị tất cả hình ảnh trong gallery
  void _showFullGallery(BuildContext context, List<String> images) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.9,
          maxChildSize: 0.95,
          minChildSize: 0.7,
          builder: (context, scrollController) {
            return Container(
              color: Colors.white,
              child: Column(
                children: [
                  // Header
                  Container(
                    padding: const EdgeInsets.symmetric(
                      vertical: 16,
                      horizontal: 16,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 5,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Tất cả hình ảnh (${images.length})',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => Navigator.of(context).pop(),
                        ),
                      ],
                    ),
                  ),
                  // Gallery
                  Expanded(
                    child: GridView.builder(
                      controller: scrollController,
                      padding: const EdgeInsets.all(8),
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            childAspectRatio: 1,
                            crossAxisSpacing: 8,
                            mainAxisSpacing: 8,
                          ),
                      itemCount: images.length,
                      itemBuilder: (context, index) {
                        return GestureDetector(
                          onTap: () {
                            showDialog(
                              context: context,
                              builder: (_) => Dialog(
                                backgroundColor: Colors.transparent,
                                child: GestureDetector(
                                  onTap: () => Navigator.of(context).pop(),
                                  child: InteractiveViewer(
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(12),
                                      child: Image.network(
                                        ApiConstants.baseUrl + images[index],
                                        fit: BoxFit.contain,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            );
                          },
                          child: Hero(
                            tag: 'gallery_image_$index',
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.network(
                                ApiConstants.baseUrl + images[index],
                                fit: BoxFit.cover,
                                loadingBuilder: (context, child, progress) {
                                  if (progress == null) return child;
                                  return const Center(
                                    child: CircularProgressIndicator(
                                      color: Colors.orange,
                                    ),
                                  );
                                },
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final now = DateTime.now();

    // Kiểm tra nếu có ngày được truyền vào từ màn hình khác
    if (widget.checkIn != null) {
      // Sử dụng ngày được truyền vào nhưng đặt giờ mặc định
      _checkIn = DateTime(
        widget.checkIn!.year,
        widget.checkIn!.month,
        widget.checkIn!.day,
        14, // Giờ mặc định, sẽ được cập nhật sau theo chính sách
        0,
      );
    } else {
      // Nếu không có ngày truyền vào, sử dụng ngày hiện tại
      _checkIn = DateTime(now.year, now.month, now.day, 14, 0);
    }

    // Tương tự cho ngày trả phòng
    if (widget.checkOut != null) {
      _checkOut = DateTime(
        widget.checkOut!.year,
        widget.checkOut!.month,
        widget.checkOut!.day,
        12, // Giờ mặc định, sẽ được cập nhật sau theo chính sách
        0,
      );
    } else {
      // Nếu không có ngày trả phòng, mặc định là ngày sau ngày nhận
      _checkOut = DateTime(
        _checkIn.year,
        _checkIn.month,
        _checkIn.day + 1,
        12,
        0,
      );
    }

    // Đảm bảo ngày trả phòng luôn sau ngày nhận phòng
    if (_checkOut.difference(_checkIn).inDays <= 0) {
      _checkOut = DateTime(
        _checkIn.year,
        _checkIn.month,
        _checkIn.day + 1,
        12,
        0,
      );
    }

    // Đợi lấy thông tin homestay để cập nhật giờ chính xác theo chính sách
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _updateCheckInOutTimes();
    });
  } // Phương thức để cập nhật giờ nhận/trả phòng theo chính sách của homestay

  void _updateCheckInOutTimes() {
    final state = context.read<HomeBloc>().state;
    if (state is HomeDetailLoaded) {
      final chinhSach = state.detail.chinhSach;
      if (chinhSach.nhanPhong.isNotEmpty && chinhSach.traPhong.isNotEmpty) {
        try {
          // Phân tích giờ nhận phòng từ chuỗi (vd: "14:00")
          final nhanPhongParts = chinhSach.nhanPhong.split(':');
          final hour = int.tryParse(nhanPhongParts[0]) ?? 14;
          final minute = int.tryParse(nhanPhongParts[1]) ?? 0;

          // Phân tích giờ trả phòng từ chuỗi (vd: "12:00")
          final traPhongParts = chinhSach.traPhong.split(':');
          final hourOut = int.tryParse(traPhongParts[0]) ?? 12;
          final minuteOut = int.tryParse(traPhongParts[1]) ?? 0;

          setState(() {
            // Cập nhật _checkIn và _checkOut với giờ từ chính sách
            // Giữ nguyên ngày nhưng cập nhật giờ theo chính sách
            _checkIn = DateTime(
              _checkIn.year,
              _checkIn.month,
              _checkIn.day,
              hour,
              minute,
            );

            _checkOut = DateTime(
              _checkOut.year,
              _checkOut.month,
              _checkOut.day,
              hourOut,
              minuteOut,
            );

            // Đảm bảo ngày checkout không trùng với ngày checkin
            if (_checkOut.difference(_checkIn).inDays <= 0) {
              // Nếu cùng ngày, tự động điều chỉnh checkout sang ngày hôm sau
              _checkOut = DateTime(
                _checkIn.year,
                _checkIn.month,
                _checkIn.day + 1,
                hourOut,
                minuteOut,
              );
            }
          });
        } catch (e) {
          print('Lỗi khi phân tích thời gian: $e');
        }
      }
    }
  }

  Future<void> _selectDateRange() async {
    final now = DateTime.now();
    // Tạo ngày giới hạn cho việc đặt trước (tối đa 1 tháng)
    final maxDateAhead = DateTime(now.year, now.month + 1, now.day);

    final picked = await showDateRangePicker(
      context: context,
      initialDateRange: DateTimeRange(start: _checkIn, end: _checkOut),
      firstDate: DateTime(now.year, now.month, now.day),
      // Giới hạn đặt phòng không quá 1 tháng tính từ ngày hiện tại
      lastDate: maxDateAhead,
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
      // Tính số ngày giữa ngày bắt đầu và kết thúc
      final days = picked.end.difference(picked.start).inDays;

      // Kiểm tra ngày bắt đầu và ngày kết thúc có trùng nhau không
      if (days == 0) {
        // ignore: use_build_context_synchronously
        await showAppDialog(
          context: context,
          title: 'Lỗi',
          message: 'Ngày trả phòng không được trùng với ngày nhận phòng.',
          type: AppDialogType.warning,
          buttonText: 'Đóng',
        );
        return;
      }

      // Kiểm tra nếu cùng năm hiện tại
      final isSameYear =
          picked.start.year == now.year && picked.end.year == now.year;

      // Kiểm tra số ngày tối đa
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

      // Kiểm tra không cho đặt trước quá 1 tháng
      final oneMonthLater = DateTime(now.year, now.month + 1, now.day);
      if (picked.start.isAfter(oneMonthLater)) {
        // ignore: use_build_context_synchronously
        await showAppDialog(
          context: context,
          title: 'Lỗi',
          message:
              'Bạn không thể đặt phòng trước quá 1 tháng từ ngày hiện tại.',
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
        // Lấy thời gian từ state hiện tại nếu có
        final state = context.read<HomeBloc>().state;
        int hourIn = 14; // Giờ mặc định
        int minuteIn = 0;
        int hourOut = 12; // Giờ mặc định
        int minuteOut = 0;

        // Nếu đã có thông tin chính sách, sử dụng thời gian từ chính sách
        if (state is HomeDetailLoaded) {
          final chinhSach = state.detail.chinhSach;
          if (chinhSach.nhanPhong.isNotEmpty) {
            try {
              final parts = chinhSach.nhanPhong.split(':');
              if (parts.length == 2) {
                hourIn = int.tryParse(parts[0]) ?? 14;
                minuteIn = int.tryParse(parts[1]) ?? 0;
              }
            } catch (e) {}
          }

          if (chinhSach.traPhong.isNotEmpty) {
            try {
              final parts = chinhSach.traPhong.split(':');
              if (parts.length == 2) {
                hourOut = int.tryParse(parts[0]) ?? 12;
                minuteOut = int.tryParse(parts[1]) ?? 0;
              }
            } catch (e) {}
          }
        }

        _checkIn = DateTime(
          picked.start.year,
          picked.start.month,
          picked.start.day,
          hourIn,
          minuteIn,
        );

        _checkOut = DateTime(
          picked.end.year,
          picked.end.month,
          picked.end.day,
          hourOut,
          minuteOut,
        );

        // Cập nhật lại giờ từ chính sách một lần nữa để đảm bảo chính xác
        // Điều này quan trọng trong trường hợp chính sách thay đổi sau khi màn hình được load
        _updateCheckInOutTimes();
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

  // Phương thức để xây dựng thẻ tiện nghi
  Widget _buildAmenityItem(String amenityName) {
    // Map tiện nghi với biểu tượng tương ứng
    final Map<String, IconData> amenityIcons = {
      'Wifi': Icons.wifi,
      'wifi': Icons.wifi,
      'Bể bơi': Icons.pool,
      'bể bơi': Icons.pool,
      'Điều hòa': Icons.ac_unit,
      'điều hòa': Icons.ac_unit,
      'Bãi đỗ xe': Icons.local_parking,
      'bãi đỗ xe': Icons.local_parking,
      'Nhà hàng': Icons.restaurant,
      'nhà hàng': Icons.restaurant,
      'Phòng gym': Icons.fitness_center,
      'phòng gym': Icons.fitness_center,
      'Dịch vụ phòng': Icons.room_service,
      'dịch vụ phòng': Icons.room_service,
      'Máy giặt': Icons.local_laundry_service,
      'máy giặt': Icons.local_laundry_service,
      'TV': Icons.tv,
      'tv': Icons.tv,
      'Lò vi sóng': Icons.microwave,
      'lò vi sóng': Icons.microwave,
      'Bồn tắm': Icons.bathtub,
      'bồn tắm': Icons.bathtub,
      'Spa': Icons.spa,
      'spa': Icons.spa,
      'Bar': Icons.local_bar,
      'bar': Icons.local_bar,
      'Thang máy': Icons.elevator,
      'thang máy': Icons.elevator,
      'Sân thượng': Icons.deck,
      'sân thượng': Icons.deck,
      'Ban công': Icons.balcony,
      'ban công': Icons.balcony,
      'An ninh 24/7': Icons.security,
      'an ninh 24/7': Icons.security,
    };

    // Lấy biểu tượng dựa trên tên tiện nghi hoặc sử dụng biểu tượng mặc định
    final IconData iconData =
        amenityIcons[amenityName] ?? Icons.check_circle_outline;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.2),
            spreadRadius: 1,
            blurRadius: 3,
            offset: const Offset(0, 1),
          ),
        ],
        border: Border.all(color: Colors.grey.shade200),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(iconData, size: 20, color: Colors.blue[700]),
          const SizedBox(width: 8),
          Text(
            amenityName,
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  // Phương thức hiển thị tất cả tiện nghi trong một dialog
  void _showAllAmenities(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return DraggableScrollableSheet(
          expand: false,
          initialChildSize: 0.7,
          maxChildSize: 0.9,
          minChildSize: 0.5,
          builder: (context, scrollController) {
            return BlocBuilder<HomeBloc, HomeState>(
              buildWhen: (prev, curr) => curr is HomeTienNghiLoaded,
              builder: (context, state) {
                if (state is HomeTienNghiLoaded) {
                  final tiennghi = state.tiennghi.tienNghis;

                  // Tạo các nhóm tiện nghi (bạn có thể điều chỉnh nhóm theo nhu cầu)
                  Map<String, List<String>> groupedAmenities = {
                    'Tiện nghi chung': [],
                    'Phòng tắm': [],
                    'Phòng ngủ': [],
                    'Giải trí': [],
                    'Khác': [],
                  };

                  // Phân loại tiện nghi vào các nhóm
                  for (var amenity in tiennghi) {
                    String name = amenity.tenTienNghi;
                    if (name.toLowerCase().contains('wifi') ||
                        name.toLowerCase().contains('điều hòa') ||
                        name.toLowerCase().contains('bãi đỗ xe') ||
                        name.toLowerCase().contains('nhà hàng') ||
                        name.toLowerCase().contains('thang máy')) {
                      groupedAmenities['Tiện nghi chung']!.add(name);
                    } else if (name.toLowerCase().contains('bồn tắm') ||
                        name.toLowerCase().contains('vòi sen') ||
                        name.toLowerCase().contains('khăn tắm')) {
                      groupedAmenities['Phòng tắm']!.add(name);
                    } else if (name.toLowerCase().contains('giường') ||
                        name.toLowerCase().contains('chăn') ||
                        name.toLowerCase().contains('gối')) {
                      groupedAmenities['Phòng ngủ']!.add(name);
                    } else if (name.toLowerCase().contains('tv') ||
                        name.toLowerCase().contains('hồ bơi') ||
                        name.toLowerCase().contains('bể bơi') ||
                        name.toLowerCase().contains('phòng gym')) {
                      groupedAmenities['Giải trí']!.add(name);
                    } else {
                      groupedAmenities['Khác']!.add(name);
                    }
                  }

                  return Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(vertical: 15),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: const BorderRadius.vertical(
                            top: Radius.circular(20),
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 5,
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            Container(
                              width: 40,
                              height: 5,
                              decoration: BoxDecoration(
                                color: Colors.grey[300],
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            const SizedBox(height: 15),
                            const Text(
                              'Tất cả tiện nghi',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Expanded(
                        child: ListView.builder(
                          controller: scrollController,
                          padding: const EdgeInsets.all(16),
                          itemCount: groupedAmenities.keys.length,
                          itemBuilder: (context, index) {
                            String groupName = groupedAmenities.keys.elementAt(
                              index,
                            );
                            List<String> amenities =
                                groupedAmenities[groupName]!;

                            // Nếu nhóm không có tiện nghi, bỏ qua
                            if (amenities.isEmpty)
                              return const SizedBox.shrink();

                            return Padding(
                              padding: const EdgeInsets.only(bottom: 24),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    groupName,
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.black87,
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                  Wrap(
                                    spacing: 12,
                                    runSpacing: 12,
                                    children: amenities
                                        .map((name) => _buildAmenityItem(name))
                                        .toList(),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  );
                }
                return const Center(child: CircularProgressIndicator());
              },
            );
          },
        );
      },
    );
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
              padding: const EdgeInsets.only(bottom: 200),
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
                            Container(
                              height: 220, // Giảm chiều cao từ 250 xuống 220
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    blurRadius: 10,
                                    offset: const Offset(0, 3),
                                  ),
                                ],
                              ),
                              clipBehavior: Clip.antiAlias, // Để bo góc cho ảnh
                              child: Stack(
                                children: [
                                  PageView.builder(
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
                                              backgroundColor:
                                                  Colors.transparent,
                                              child: GestureDetector(
                                                onTap: () =>
                                                    Navigator.of(context).pop(),
                                                child: InteractiveViewer(
                                                  child: ClipRRect(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                          12,
                                                        ),
                                                    child: Image.network(
                                                      ApiConstants.baseUrl +
                                                          images[index],
                                                      fit: BoxFit.contain,
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ),
                                          );
                                        },
                                        child: Container(
                                          width: MediaQuery.of(
                                            context,
                                          ).size.width,
                                          child: Image.network(
                                            ApiConstants.baseUrl +
                                                images[index],
                                            fit: BoxFit.cover,
                                            loadingBuilder:
                                                (context, child, progress) {
                                                  if (progress == null)
                                                    return child;
                                                  return const Center(
                                                    child:
                                                        CircularProgressIndicator(
                                                          color: Colors.orange,
                                                          strokeWidth: 3,
                                                        ),
                                                  );
                                                },
                                          ),
                                        ),
                                      );
                                    },
                                  ),
                                  // Gradient overlay ở phía dưới ảnh
                                  Positioned(
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: 60,
                                    child: Container(
                                      decoration: BoxDecoration(
                                        gradient: LinearGradient(
                                          begin: Alignment.topCenter,
                                          end: Alignment.bottomCenter,
                                          colors: [
                                            Colors.transparent,
                                            Colors.black.withOpacity(0.4),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ),
                                  // Nút chuyển ảnh bên trái
                                  if (images.length > 1)
                                    Positioned(
                                      left: 10,
                                      top: 0,
                                      bottom: 0,
                                      child: Center(
                                        child: InkWell(
                                          onTap: () {
                                            if (_currentImageIndex > 0) {
                                              _pageController.previousPage(
                                                duration: const Duration(
                                                  milliseconds: 300,
                                                ),
                                                curve: Curves.easeInOut,
                                              );
                                            }
                                          },
                                          child: Container(
                                            width: 36,
                                            height: 36,
                                            decoration: BoxDecoration(
                                              color: Colors.white.withOpacity(
                                                0.8,
                                              ),
                                              shape: BoxShape.circle,
                                            ),
                                            child: const Icon(
                                              Icons.chevron_left,
                                              color: Colors.black87,
                                              size: 24,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  // Nút chuyển ảnh bên phải
                                  if (images.length > 1)
                                    Positioned(
                                      right: 10,
                                      top: 0,
                                      bottom: 0,
                                      child: Center(
                                        child: InkWell(
                                          onTap: () {
                                            if (_currentImageIndex <
                                                images.length - 1) {
                                              _pageController.nextPage(
                                                duration: const Duration(
                                                  milliseconds: 300,
                                                ),
                                                curve: Curves.easeInOut,
                                              );
                                            }
                                          },
                                          child: Container(
                                            width: 36,
                                            height: 36,
                                            decoration: BoxDecoration(
                                              color: Colors.white.withOpacity(
                                                0.8,
                                              ),
                                              shape: BoxShape.circle,
                                            ),
                                            child: const Icon(
                                              Icons.chevron_right,
                                              color: Colors.black87,
                                              size: 24,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 10),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.grey.shade200,
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.photo_library_outlined,
                                        size: 14,
                                        color: Colors.grey.shade700,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        '${_currentImageIndex + 1}/${images.length}',
                                        style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w500,
                                          color: Colors.grey.shade800,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 8),
                                AnimatedSmoothIndicator(
                                  activeIndex: _currentImageIndex,
                                  count: images.length,
                                  effect: ExpandingDotsEffect(
                                    dotHeight: 6,
                                    dotWidth: 6,
                                    expansionFactor: 2.5,
                                    activeDotColor: Colors.orange,
                                    dotColor: Colors.grey.shade300,
                                    spacing: 4,
                                  ),
                                ),
                              ],
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
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Tiện ích nổi bật',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        InkWell(
                          onTap: () {
                            _showAllAmenities(context);
                          },
                          child: const Text(
                            'Xem tất cả',
                            style: TextStyle(
                              color: Colors.blue,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
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

                        // Hiển thị tiện nghi dạng thẻ với biểu tượng
                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          child: Wrap(
                            spacing: 12,
                            runSpacing: 12,
                            children: List.generate(
                              tiennghi.length > 8 ? 8 : tiennghi.length,
                              (index) {
                                return _buildAmenityItem(
                                  tiennghi[index].tenTienNghi,
                                );
                              },
                            ),
                          ),
                        );
                      } else if (state is HomeTienNghiError) {
                        return ErrorDisplay(errorMessage: state.message);
                      }
                      return const SizedBox.shrink();
                    },
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
            // Date range and booking bar (fixed at bottom)
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 10,
                      offset: const Offset(0, -2),
                    ),
                  ],
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(20),
                    topRight: Radius.circular(20),
                  ),
                ),
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 20),
                child: BlocBuilder<HomeBloc, HomeState>(
                  buildWhen: (prev, curr) =>
                      curr is HomeDetailLoaded || curr is HomeDetailError,
                  builder: (context, state) {
                    if (state is! HomeDetailLoaded)
                      return const SizedBox.shrink();
                    final detail = state.detail;
                    final price = detail.giaTien;
                    // Tính số ngày đặt phòng
                    int soNgay = _checkOut.difference(_checkIn).inDays;
                    // Đảm bảo số ngày luôn ít nhất là 1
                    soNgay = soNgay > 0 ? soNgay : 1;
                    final nhanPhong = detail.chinhSach.nhanPhong;
                    final traPhong = detail.chinhSach.traPhong;
                    final total = price * soNgay;
                    return Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Date Selection Container
                        GestureDetector(
                          onTap: _selectDateRange,
                          child: Container(
                            width: double.infinity,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.blue.shade50,
                                  Colors.blue.shade100,
                                ],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.blue.withOpacity(0.2),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 14,
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: const Icon(
                                    Icons.calendar_today_rounded,
                                    color: Colors.orange,
                                    size: 18,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.orange.shade50,
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: Colors.orange.shade200,
                                      width: 1,
                                    ),
                                  ),
                                  child: Text(
                                    soNgay == 1 ? '01 ngày' : '$soNgay ngày',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                      color: Colors.orange.shade800,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            _formatDate(_checkIn),
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 12,
                                            ),
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            _formatTime(_checkIn),
                                            style: TextStyle(
                                              fontSize: 11,
                                              color: Colors.grey[700],
                                            ),
                                          ),
                                        ],
                                      ),
                                      Container(
                                        width: 26,
                                        height: 26,
                                        decoration: BoxDecoration(
                                          color: Colors.white,
                                          shape: BoxShape.circle,
                                        ),
                                        child: const Icon(
                                          Icons.arrow_forward,
                                          size: 16,
                                          color: Colors.blue,
                                        ),
                                      ),
                                      Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.end,
                                        children: [
                                          Text(
                                            _formatDate(_checkOut),
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 12,
                                            ),
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            _formatTime(_checkOut),
                                            style: TextStyle(
                                              fontSize: 11,
                                              color: Colors.grey[700],
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

                        const SizedBox(height: 16),

                        // Divider with small icons
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                height: 1,
                                color: Colors.grey.shade200,
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                              ),
                              child: Icon(
                                Icons.hotel,
                                size: 16,
                                color: Colors.grey.shade400,
                              ),
                            ),
                            Expanded(
                              child: Container(
                                height: 1,
                                color: Colors.grey.shade200,
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 16),

                        // Bottom row with price and button
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Tổng thanh toán',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w500,
                                    color: Colors.grey,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                if (price > 0 && soNgay > 0)
                                  Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.baseline,
                                    textBaseline: TextBaseline.alphabetic,
                                    children: [
                                      Text(
                                        '${_formatCurrency(total)}',
                                        style: const TextStyle(
                                          fontSize: 22,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.black,
                                        ),
                                      ),
                                      const Text(
                                        'đ',
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.black,
                                        ),
                                      ),
                                    ],
                                  ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    Icon(
                                      Icons.access_time,
                                      size: 12,
                                      color: Colors.grey.shade600,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      'Nhận: $nhanPhong • Trả: $traPhong',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: Colors.grey.shade600,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.orange,
                                foregroundColor: Colors.white,
                                elevation: 2,
                                shadowColor: Colors.orange.withOpacity(0.5),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 20,
                                  vertical: 12,
                                ),
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
                              child: Row(
                                children: [
                                  const Text(
                                    'Chọn phòng',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  const Icon(
                                    Icons.arrow_forward_rounded,
                                    size: 16,
                                  ),
                                ],
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
