package com.bookinghomestay.app.application.host.dashboard.query;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.host.dashboard.dto.ChangePercentages;
import com.bookinghomestay.app.application.host.dashboard.dto.HostDashBoardStatsDto;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.repository.IReviewRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.BookingService;
import com.bookinghomestay.app.domain.service.HomestayService;
import com.bookinghomestay.app.domain.service.ReviewService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetHostStatsDashBoardQuey {
        private final IHomestayRepository homestayRepository;
        private final IReviewRepository reviewRepository;
        private final IBookingRepository bookingRepository;
        private final BookingService bookingService;
        private final HomestayService homestayService;
        private final IUserRepository userRepository;
        private final ReviewService reviewService;

        public HostDashBoardStatsDto handle(String hostId, Integer period) {
                User host = userRepository.findById(hostId)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy host !"));
                int days = (period != null && period > 0) ? period : 7;
                // list all bookings of host
                List<PhieuDatPhong> allBookings = bookingService.findBookingByHostId(host.getUserId(),
                                bookingRepository.findAllWithHoaDonAndThanhToan());
                int totalBookings = allBookings.size();
                // calculate stats
                LocalDateTime currentEnd = LocalDateTime.now();
                LocalDateTime currentStart = currentEnd.minusDays(days);
                LocalDateTime previousStart = currentStart.minusDays(days);
                LocalDateTime previousEnd = currentStart;

                // Calculate monthly revenue
                int monthlyRevenue = bookingService.calculateRevenue(allBookings, currentStart, currentEnd).intValue();
                BigDecimal previousRevenue = bookingService.calculateRevenue(allBookings, previousStart, currentStart);

                // list homestays of host
                List<Homestay> hostHomestays = homestayRepository.getAll().stream()
                                .filter(homestay -> homestay.getNguoiDung().getUserId().equalsIgnoreCase(hostId))
                                .toList();
                int totalHomestays = hostHomestays.size();
                int activeHomestays = (int) hostHomestays.stream()
                                .filter(homestay -> homestay.getTrangThai().equalsIgnoreCase("active"))
                                .count();
                // calculate reviews and ratings
                int totalReviews = reviewRepository.getAll().stream()
                                .filter(review -> review.getHomestay().getNguoiDung().getUserId()
                                                .equalsIgnoreCase(hostId))
                                .toList().size();
                double averageRating = reviewRepository.getAll().stream()
                                .filter(review -> review.getHomestay().getNguoiDung().getUserId()
                                                .equalsIgnoreCase(hostId))
                                .mapToDouble(review -> reviewService.calculateAverageRating(review))
                                .average()
                                .orElse(0.0);

                int totalRevenue = hostHomestays.stream()
                                .mapToInt(homestay -> (int) homestayService.calculateRevenueByHomestay(homestay))
                                .sum();
                // Calculate previous period stats for comparison
                long currentBookings = bookingService.countBookings(allBookings, currentStart, currentEnd);
                long previousBookings = bookingService.countBookings(allBookings, previousStart, previousEnd);
                double previousRating = reviewRepository.getAll().stream()
                                .filter(review -> review.getHomestay().getNguoiDung().getUserId()
                                                .equalsIgnoreCase(hostId))
                                .filter(review -> review.getNgayDanhGia() != null
                                                && !review.getNgayDanhGia().isBefore(previousStart)
                                                && review.getNgayDanhGia().isBefore(previousEnd))
                                .mapToDouble(review -> reviewService.calculateAverageRating(review))
                                .average()
                                .orElse(0.0);

                ChangePercentages changePercentages = new ChangePercentages();
                changePercentages.setRevenue(
                                calculateChangePercent(BigDecimal.valueOf(monthlyRevenue), previousRevenue));
                // For bookings change percentage
                changePercentages.setBookings(calculateChangePercent(
                                currentBookings,
                                previousBookings));
                // For rating change percentage
                changePercentages.setRating(calculateChangePercent(
                                BigDecimal.valueOf(averageRating),
                                BigDecimal.valueOf(previousRating)));
                return new HostDashBoardStatsDto(totalRevenue, monthlyRevenue, totalBookings, totalHomestays,
                                activeHomestays,
                                averageRating,
                                totalReviews, changePercentages);
        }

        private String calculateChangePercent(BigDecimal current, BigDecimal previous) {
                if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
                        return "+0.0%";
                }
                BigDecimal change = current.subtract(previous)
                                .divide(previous, 3, RoundingMode.HALF_UP)
                                .multiply(new BigDecimal("100"));
                return String.format("%+.1f%%", change);
        }

        private String calculateChangePercent(long current, long previous) {
                return calculateChangePercent(
                                new BigDecimal(current),
                                new BigDecimal(previous));
        }
}
