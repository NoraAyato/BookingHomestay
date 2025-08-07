import 'dart:math';
import 'package:flutter/material.dart';

class LoadingOverlay extends StatefulWidget {
  final bool isLoading;
  final Widget child;
  final List<Widget>? icons;
  final String? loadingText;

  const LoadingOverlay({
    required this.isLoading,
    required this.child,
    this.icons,
    this.loadingText,
    Key? key,
  }) : super(key: key);

  @override
  _LoadingOverlayState createState() => _LoadingOverlayState();
}

class _LoadingOverlayState extends State<LoadingOverlay>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  List<bool> showIcons = [];
  int currentIndex = 0;
  double iconRadius = 40.0; // Bán kính vòng tròn icon

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();

    if (widget.icons != null) {
      showIcons = List<bool>.filled(widget.icons!.length, false);
      _startIconAnimation();
    }
  }

  void _startIconAnimation() {
    Future.doWhile(() async {
      if (currentIndex < widget.icons!.length) {
        await Future.delayed(const Duration(milliseconds: 200));
        if (mounted) {
          setState(() {
            showIcons[currentIndex] = true;
            currentIndex++;
          });
        }
        return true;
      }
      return false;
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        widget.child,
        if (widget.isLoading)
          AbsorbPointer(
            absorbing: true,
            child: Container(
              color: Colors.black.withOpacity(0.4),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      height: 150,
                      width: 150,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          // Vòng chấm loading xung quanh
                          CustomPaint(
                            painter: CircleDotsPainter(
                              progress: _controller.value,
                            ),
                            size: const Size(150, 150),
                          ),

                          // Các icon xếp thành vòng tròn
                          if (widget.icons != null)
                            ...List.generate(widget.icons!.length, (index) {
                              final angle =
                                  2 * pi * index / widget.icons!.length;
                              final x = iconRadius * cos(angle);
                              final y = iconRadius * sin(angle);

                              return AnimatedPositioned(
                                duration: const Duration(milliseconds: 500),
                                curve: Curves.easeOutBack,
                                left:
                                    75 + x - 12, // 75 = 150/2, 12 = iconSize/2
                                top: 75 + y - 12,
                                child: AnimatedOpacity(
                                  opacity: showIcons[index] ? 1.0 : 0.0,
                                  duration: const Duration(milliseconds: 300),
                                  child: Transform.scale(
                                    scale: showIcons[index] ? 1.0 : 0.5,
                                    child: widget.icons![index],
                                  ),
                                ),
                              );
                            }),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      widget.loadingText ?? 'Đang tải dữ liệu...',
                      style: const TextStyle(color: Colors.white, fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class CircleDotsPainter extends CustomPainter {
  final double progress;

  CircleDotsPainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 15;
    const dotCount = 12;
    const dotRadius = 4.0;

    final paint = Paint()
      ..color = Colors.white.withOpacity(0.8)
      ..style = PaintingStyle.fill;

    for (var i = 0; i < dotCount; i++) {
      final angle = 2 * pi * i / dotCount;
      final x = center.dx + radius * cos(angle);
      final y = center.dy + radius * sin(angle);

      // Hiệu ứng nhấp nháy
      final dotOpacity = (sin(progress * 2 * pi + angle) + 1) / 2 * 0.8;
      paint.color = Colors.white.withOpacity(dotOpacity);

      canvas.drawCircle(Offset(x, y), dotRadius, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
