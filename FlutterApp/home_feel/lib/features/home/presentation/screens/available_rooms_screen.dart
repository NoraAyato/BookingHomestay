import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:home_feel/features/home/presentation/bloc/home_bloc.dart';
import 'package:home_feel/features/home/presentation/bloc/home_event.dart';
import 'package:home_feel/features/home/presentation/bloc/home_state.dart';
import 'package:home_feel/features/home/data/models/available_room_model.dart';
import 'package:home_feel/features/home/data/models/room_images_model.dart';
import 'package:intl/intl.dart';

import 'dart:async';

class AvailableRoomsScreen extends StatefulWidget {
  final String homestayId;
  final DateTime checkIn;
  final DateTime checkOut;
  final String checkInTime;
  final String checkOutTime;
  const AvailableRoomsScreen({
    Key? key,
    required this.homestayId,
    required this.checkIn,
    required this.checkOut,
    required this.checkInTime,
    required this.checkOutTime,
  }) : super(key: key);

  @override
  State<AvailableRoomsScreen> createState() => _AvailableRoomsScreenState();
}

class _AvailableRoomsScreenState extends State<AvailableRoomsScreen> {
  Future<RoomImagesModel?> fetchRoomImages(String maPhong) async {
    final bloc = context.read<HomeBloc>();
    final completer = Completer<RoomImagesModel?>();
    late final StreamSubscription<HomeState> subscription;
    subscription = bloc.stream.listen((state) {
      if (state is HomeRoomImagesLoaded && state.images.maPhong == maPhong) {
        completer.complete(state.images);
        subscription.cancel();
      } else if (state is HomeRoomImagesError) {
        completer.complete(null);
        subscription.cancel();
      }
    });
    bloc.add(GetRoomImagesEvent(maPhong));
    return completer.future;
  }

  @override
  void initState() {
    super.initState();
    context.read<HomeBloc>().add(
      GetAvailableRoomsEvent(
        homestayId: widget.homestayId,
        checkIn: widget.checkIn,
        checkOut: widget.checkOut,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Danh sách phòng')),
      body: BlocBuilder<HomeBloc, HomeState>(
        builder: (context, state) {
          if (state is HomeAvailableRoomsLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is HomeAvailableRoomsLoaded) {
            if (state.rooms.isEmpty) {
              return const Center(child: Text('Không có phòng khả dụng.'));
            }
            print(
              '[AvailableRoomsScreen] build: _HeaderDateInfo + 1 _AvailableRoomItem',
            );
            return SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _HeaderDateInfo(
                    checkIn: widget.checkIn,
                    checkOut: widget.checkOut,
                    checkInTime: widget.checkInTime,
                    checkOutTime: widget.checkOutTime,
                  ),
                  ...state.rooms.map(
                    (room) => FutureBuilder<RoomImagesModel?>(
                      future: fetchRoomImages(room.maPhong),
                      builder: (context, snapshot) {
                        Widget imageWidget;
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          imageWidget = const SizedBox(
                            height: 180,
                            child: Center(child: CircularProgressIndicator()),
                          );
                        } else if (snapshot.hasData &&
                            snapshot.data != null &&
                            snapshot.data!.urlAnhs.isNotEmpty) {
                          imageWidget = SizedBox(
                            height: 180,
                            child: PageView(
                              children: snapshot.data!.urlAnhs
                                  .map(
                                    (url) => ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: Image.network(
                                        url,
                                        fit: BoxFit.cover,
                                        width: double.infinity,
                                      ),
                                    ),
                                  )
                                  .toList(),
                            ),
                          );
                        } else {
                          imageWidget = const SizedBox(
                            height: 180,
                            child: Center(child: Text('Không có ảnh phòng')),
                          );
                        }
                        return Card(
                          margin: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(12),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                imageWidget,
                                const SizedBox(height: 8),
                                Text(
                                  room.tenPhong,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 18,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Giá: '
                                  '${NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(room.giaTien)}',
                                  style: const TextStyle(
                                    fontSize: 16,
                                    color: Colors.orange,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    ElevatedButton(
                                      onPressed: () {},
                                      child: const Text('Đặt phòng'),
                                    ),
                                    const SizedBox(width: 12),
                                    const Text(
                                      'Chỉ còn 1 phòng',
                                      style: TextStyle(color: Colors.red),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          } else if (state is HomeAvailableRoomsError) {
            return Center(child: Text(state.message));
          }
          return const SizedBox.shrink();
        },
      ),
    );
  }
}

class _HeaderDateInfo extends StatelessWidget {
  final DateTime checkIn;
  final DateTime checkOut;
  final String checkInTime;
  final String checkOutTime;
  const _HeaderDateInfo({
    required this.checkIn,
    required this.checkOut,
    required this.checkInTime,
    required this.checkOutTime,
  });
  @override
  Widget build(BuildContext context) {
    print('[HeaderDateInfo] build');
    return Card(
      margin: const EdgeInsets.all(12),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Nhận phòng'),
                Text('$checkInTime, ${DateFormat('dd/MM').format(checkIn)}'),
              ],
            ),
            const Icon(Icons.arrow_forward),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Trả phòng'),
                Text('$checkOutTime, ${DateFormat('dd/MM').format(checkOut)}'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _AvailableRoomItem extends StatefulWidget {
  final AvailableRoomModel room;
  const _AvailableRoomItem({required this.room});
  @override
  State<_AvailableRoomItem> createState() => _AvailableRoomItemState();
}

class _AvailableRoomItemState extends State<_AvailableRoomItem> {
  RoomImagesModel? images;
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _fetchImages();
  }

  void _fetchImages() async {
    final bloc = context.read<HomeBloc>();
    bloc.add(GetRoomImagesEvent(widget.room.maPhong));
    late final StreamSubscription<HomeState> subscription;
    subscription = bloc.stream.listen((state) {
      if (!mounted) return;
      if (state is HomeRoomImagesLoaded &&
          state.images.maPhong == widget.room.maPhong) {
        if (mounted) {
          setState(() {
            images = state.images;
            loading = false;
          });
        }
        subscription.cancel();
      } else if (state is HomeRoomImagesError) {
        if (mounted) {
          setState(() {
            error = state.message;
            loading = false;
          });
        }
        subscription.cancel();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    try {
      print('[AvailableRoomItem] build: ${widget.room}');
      return Card(
        margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              loading
                  ? const SizedBox(
                      height: 180,
                      child: Center(child: CircularProgressIndicator()),
                    )
                  : images != null && images!.urlAnhs.isNotEmpty
                  ? SizedBox(
                      height: 180,
                      child: PageView(
                        children: images!.urlAnhs
                            .map(
                              (url) => ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: Image.network(
                                  url,
                                  fit: BoxFit.cover,
                                  width: double.infinity,
                                ),
                              ),
                            )
                            .toList(),
                      ),
                    )
                  : const SizedBox(
                      height: 180,
                      child: Center(child: Text('Không có ảnh phòng')),
                    ),
              const SizedBox(height: 8),
              Text(
                widget.room.tenPhong,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Giá: ${NumberFormat.currency(locale: 'vi_VN', symbol: 'đ').format(widget.room.giaTien)}',
                style: const TextStyle(fontSize: 16, color: Colors.orange),
              ),
              // ... Thêm các thông tin khác như số lượng, ưu đãi, nút đặt phòng ...
              const SizedBox(height: 8),
              Row(
                children: [
                  ElevatedButton(
                    onPressed: () {},
                    child: const Text('Đặt phòng'),
                  ),
                  const SizedBox(width: 12),
                  Text('Chỉ còn 1 phòng', style: TextStyle(color: Colors.red)),
                ],
              ),
              // ... Thêm các ưu đãi, chính sách ...
            ],
          ),
        ),
      );
    } catch (e, stack) {
      print('[AvailableRoomItem] build error: $e\n$stack');
      return const SizedBox.shrink();
    }
  }
}
