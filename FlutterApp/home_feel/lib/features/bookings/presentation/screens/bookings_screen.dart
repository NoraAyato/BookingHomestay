import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:home_feel/features/bookings/data/models/booking_list_response_dto.dart';
import 'package:home_feel/features/bookings/presentation/bloc/booking_bloc.dart';
import 'package:home_feel/features/bookings/presentation/bloc/booking_event.dart';
import 'package:home_feel/features/bookings/presentation/bloc/booking_state.dart';
import 'package:home_feel/features/bookings/presentation/screens/booking_detail_screen.dart';
import 'package:home_feel/shared/widgets/loading_indicator.dart';
import 'package:home_feel/features/auth/data/services/auth_service.dart';
import 'package:home_feel/core/services/service_locator.dart';
import 'package:home_feel/features/auth/presentation/screens/login_screen.dart';
import 'package:home_feel/features/auth/presentation/screens/register_screen.dart';

class BookingsScreen extends StatefulWidget {
  const BookingsScreen({super.key});

  @override
  State<BookingsScreen> createState() => _BookingsScreenState();
}

class _BookingsScreenState extends State<BookingsScreen>
    with WidgetsBindingObserver {
  bool isUserLoggedIn = false;

  // Phương thức gọi khi component được tạo
  @override
  void initState() {
    super.initState();
    // Đăng ký lắng nghe sự kiện lifecycle của ứng dụng
    WidgetsBinding.instance.addObserver(this);
    _checkLoginStatus();
  }

  // Phương thức gọi khi component bị hủy
  @override
  void dispose() {
    // Hủy đăng ký lắng nghe
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  // Phương thức gọi khi component được active
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Kiểm tra trạng thái đăng nhập khi màn hình được focus lại
    _checkLoginStatus();
  }

  // Khi widget được build lại (setState hoặc didUpdateWidget)
  @override
  void didUpdateWidget(BookingsScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Kiểm tra trạng thái đăng nhập khi widget được cập nhật
    _checkLoginStatus();
  }

  // Lắng nghe sự kiện vòng đời của ứng dụng
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      // Khi ứng dụng được mở lại, kiểm tra lại trạng thái đăng nhập
      print('BookingsScreen: App resumed, checking login status');
      _checkLoginStatus();
    }
  }

  void _checkLoginStatus() {
    if (!mounted) return;

    final authService = sl<AuthService>();
    final wasLoggedIn = isUserLoggedIn;
    final nowLoggedIn = authService.isLoggedIn();

    print(
      'BookingsScreen: Regular check - was: $wasLoggedIn, now: $nowLoggedIn',
    );

    if (wasLoggedIn != nowLoggedIn) {
      print(
        'BookingsScreen: Login status changed from $wasLoggedIn to $nowLoggedIn',
      );

      setState(() {
        isUserLoggedIn = nowLoggedIn;
      });

      if (nowLoggedIn) {
        // Nếu người dùng mới đăng nhập, tải danh sách đặt phòng
        print('BookingsScreen: User just logged in, fetching bookings');
        // Đợi một chút để đảm bảo setState đã được áp dụng
        Future.delayed(const Duration(milliseconds: 200), () {
          if (mounted) {
            context.read<BookingBloc>().add(GetMyBookingsEvent());
          }
        });
      }
    } else if (nowLoggedIn && mounted) {
      // Nếu người dùng đã đăng nhập từ trước, đảm bảo dữ liệu được tải
      final currentState = context.read<BookingBloc>().state;
      if (currentState is! MyBookingsLoaded) {
        print(
          'BookingsScreen: User already logged in but no bookings loaded, fetching bookings',
        );
        context.read<BookingBloc>().add(GetMyBookingsEvent());
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Phòng đã đặt',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.orange[100],
        elevation: 0,
      ),
      body: !isUserLoggedIn
          ? _buildNotLoggedInView()
          : BlocBuilder<BookingBloc, BookingState>(
              builder: (context, state) {
                if (state is BookingLoading) {
                  return const Center(child: LoadingIndicator());
                } else if (state is BookingError) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Có lỗi xảy ra: ${state.message}',
                          textAlign: TextAlign.center,
                          style: const TextStyle(color: Colors.red),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            context.read<BookingBloc>().add(
                              GetMyBookingsEvent(),
                            );
                          },
                          child: const Text('Thử lại'),
                        ),
                      ],
                    ),
                  );
                } else if (state is MyBookingsLoaded) {
                  if (state.bookings.isEmpty) {
                    return const Center(
                      child: Text(
                        'Bạn chưa có đặt phòng nào',
                        style: TextStyle(fontSize: 16),
                      ),
                    );
                  }
                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: state.bookings.length,
                    itemBuilder: (context, index) {
                      final booking = state.bookings[index];
                      return _buildBookingCard(booking);
                    },
                  );
                }

                // Default state or BookingInitial
                return const Center(child: LoadingIndicator());
              },
            ),
    );
  }

  Widget _buildBookingCard(BookingListResponseDto booking) {
    Color statusColor;
    String displayStatus;

    // Set color and display status based on booking status
    switch (booking.trangThai.toLowerCase()) {
      case 'booked':
        statusColor = Colors.green;
        displayStatus = 'Hoàn thành';
        break;
      case 'pending':
        statusColor = Colors.orange;
        displayStatus = 'Chờ xác nhận';
        break;
      case 'cancelled':
        statusColor = Colors.red;
        displayStatus = 'Đã hủy';
        break;
      default:
        statusColor = Colors.blue;
        displayStatus = booking.trangThai;
    }

    // Tạo string để hiển thị ngày giờ theo định dạng dd/MM/yyyy HH:mm
    final dateFormatter = DateFormat('dd/MM/yyyy');
    final timeFormatter = DateFormat('HH:mm');
    final formattedDate = dateFormatter.format(booking.ngayLap);
    final formattedTime = timeFormatter.format(booking.ngayLap);

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 0.5,
      child: InkWell(
        onTap: () {
          // Điều hướng đến màn hình chi tiết đặt phòng
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) =>
                  BookingDetailScreen(maPDP: booking.maPDPhong),
            ),
          );
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Phần đầu chứa ngày và giờ
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Ngày và giờ bên trái
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        formattedDate,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Text(
                        formattedTime,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const Spacer(),
                  // Đã loại bỏ icon 3 chấm theo yêu cầu
                ],
              ),

              const SizedBox(height: 8),

              // Trạng thái đặt phòng
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 5,
                ),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(color: statusColor, width: 1),
                ),
                child: Text(
                  displayStatus,
                  style: TextStyle(
                    color: statusColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),

              const SizedBox(height: 12),

              // Tên homestay và mã đặt phòng
              Text(
                booking.tenHomestay,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),

              const SizedBox(height: 4),

              // Tên phòng
              Text(
                'Phòng: ${booking.tenPhong}',
                style: const TextStyle(fontSize: 14),
              ),

              const SizedBox(height: 4),

              // Mã đặt phòng
              Text(
                'Mã đặt phòng: ${booking.maPDPhong}',
                style: TextStyle(fontSize: 14, color: Colors.grey[600]),
              ),

              const SizedBox(height: 8),

              // Giá phòng
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    booking.formattedPrice,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.orange,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Hiển thị overlay đăng nhập
  void _navigateToLogin() {
    print('BookingsScreen: Opening login overlay');

    // Ghi nhận trạng thái đăng nhập trước khi mở overlay
    final authService = sl<AuthService>();
    final wasLoggedIn = authService.isLoggedIn();

    // Tự triển khai cách hiển thị login thay vì dùng LoginService.showLoginOverlay
    // để có thể chủ động kiểm tra trạng thái đăng nhập khi đóng overlay
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => LoginScreen(
          onClose: () {
            Navigator.pop(context);
            // Kiểm tra trạng thái đăng nhập ngay sau khi đóng overlay
            _forceCheckLoginStatus();
          },
          onRegister: () {
            Navigator.pop(context);
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => RegisterScreen(
                  onClose: () {
                    Navigator.pop(context);
                    _forceCheckLoginStatus();
                  },
                  onLogin: () {
                    Navigator.pop(context);
                    _navigateToLogin();
                  },
                ),
              ),
            );
          },
        ),
      ),
    ).then((_) {
      // Kiểm tra trạng thái đăng nhập khi route đóng
      _forceCheckLoginStatus();
    });

    // Vẫn lên lịch kiểm tra như trước để đảm bảo không bỏ sót
    _scheduleLoginChecks(wasLoggedIn);
  }

  // Kiểm tra trạng thái đăng nhập ngay lập tức và buộc cập nhật UI
  void _forceCheckLoginStatus() {
    if (!mounted) return;

    final authService = sl<AuthService>();
    final wasLoggedIn = isUserLoggedIn;
    final nowLoggedIn = authService.isLoggedIn();

    print(
      'BookingsScreen: Force checking login status - was: $wasLoggedIn, now: $nowLoggedIn',
    );

    // Cập nhật UI bất kể trạng thái có thay đổi hay không
    setState(() {
      isUserLoggedIn = nowLoggedIn;
    });

    if (nowLoggedIn) {
      // Nếu người dùng đã đăng nhập, tải danh sách đặt phòng
      print(
        'BookingsScreen: User is logged in after overlay closed, fetching bookings',
      );

      // Đợi một chút để đảm bảo setState đã được áp dụng
      Future.delayed(const Duration(milliseconds: 100), () {
        if (mounted) {
          context.read<BookingBloc>().add(GetMyBookingsEvent());
        }
      });
    }
  }

  // Lên lịch kiểm tra đăng nhập nhiều lần với khoảng thời gian khác nhau
  void _scheduleLoginChecks(bool previousLoginState) {
    print(
      'BookingsScreen: Scheduling login checks, previous state: $previousLoginState',
    );

    // Danh sách các thời điểm kiểm tra (milli giây)
    final checkTimes = [300, 600, 1000, 1500, 2000, 3000, 5000];

    // Lập lịch kiểm tra tại các thời điểm khác nhau
    for (final delay in checkTimes) {
      Future.delayed(Duration(milliseconds: delay), () {
        if (!mounted) return;

        // Kiểm tra trạng thái đăng nhập hiện tại
        final authService = sl<AuthService>();
        final currentlyLoggedIn = authService.isLoggedIn();

        print(
          'BookingsScreen: Delayed check after ${delay}ms - previous: $previousLoginState, current: $currentlyLoggedIn',
        );

        // Nếu trạng thái đăng nhập đã thay đổi (từ chưa đăng nhập sang đã đăng nhập)
        if (!previousLoginState && currentlyLoggedIn) {
          print(
            'BookingsScreen: Login detected in delayed check after ${delay}ms!',
          );

          // Cập nhật UI
          setState(() {
            isUserLoggedIn = true;
          });

          // Tải dữ liệu đặt phòng
          Future.delayed(const Duration(milliseconds: 200), () {
            if (mounted) {
              context.read<BookingBloc>().add(GetMyBookingsEvent());
            }
          });
        }
      });
    }
  } // Hiển thị giao diện khi người dùng chưa đăng nhập

  Widget _buildNotLoggedInView() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Hình ảnh minh họa
          Image.asset(
            'assets/images/gift_illustration.png',
            width: 200,
            height: 200,
            errorBuilder: (context, error, stackTrace) {
              // Nếu không tìm thấy hình ảnh, hiển thị icon mặc định
              return const Icon(
                Icons.account_circle,
                size: 150,
                color: Colors.grey,
              );
            },
          ),
          const SizedBox(height: 24),
          // Tiêu đề
          const Text(
            'Chờ chút! Để xem thông tin đặt phòng của bạn,\nhãy đăng nhập trước đã nhé!',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 32),
          // Nút đăng nhập
          ElevatedButton(
            onPressed: _navigateToLogin,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.orange,
              foregroundColor: Colors.white,
              minimumSize: const Size(200, 50),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(25),
              ),
              elevation: 0,
            ),
            child: const Text(
              'Đăng nhập/ Đăng ký',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }
}
