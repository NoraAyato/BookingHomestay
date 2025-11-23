package com.bookinghomestay.app.infrastructure.service;

import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.service.HomestayService;
import com.bookinghomestay.app.infrastructure.persistence.document.HomestayDocument;
import com.bookinghomestay.app.infrastructure.persistence.repository.mongodb.MongoHomestayRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service to sync homestay data from SQL Server to MongoDB for AI queries
 */
@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "ai.mongodb.enabled", havingValue = "true", matchIfMissing = false)
public class HomestayDataSyncService {

    private final IHomestayRepository sqlHomestayRepository;
    private final MongoHomestayRepository mongoHomestayRepository;
    private final HomestayService homestayService;

    /**
     * Sync all homestays from SQL Server to MongoDB
     */
    @Async
    @Transactional(readOnly = true)
    public void syncAllHomestays() {
        try {
            log.info("Starting full homestay sync from SQL Server to MongoDB");

            // Get all homestays from SQL Server
            List<Homestay> sqlHomestays = sqlHomestayRepository.getAllActiveHomestay();

            log.info("Found {} homestays in SQL Server", sqlHomestays.size());

            // Convert and save to MongoDB
            List<HomestayDocument> mongoDocuments = sqlHomestays.stream()
                    .map(this::convertToDocument)
                    .collect(Collectors.toList());

            // Clear existing data and insert new
            mongoHomestayRepository.deleteAll();
            mongoHomestayRepository.saveAll(mongoDocuments);

            log.info("Successfully synced {} homestays to MongoDB", mongoDocuments.size());

        } catch (Exception e) {
            log.error("Error during homestay sync", e);
        }
    }

    /**
     * Sync single homestay
     */
    public void syncHomestay(String homestayId) {
        try {
            log.info("Syncing single homestay: {}", homestayId);

            var homestayOpt = sqlHomestayRepository.findById(homestayId);
            if (homestayOpt.isPresent()) {
                HomestayDocument document = convertToDocument(homestayOpt.get());
                mongoHomestayRepository.save(document);
                log.info("Successfully synced homestay {}", homestayId);
            } else {
                log.warn("Homestay not found in SQL Server: {}", homestayId);
            }

        } catch (Exception e) {
            log.error("Error syncing homestay {}", homestayId, e);
        }
    }

    /**
     * Scheduled sync every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    @Transactional(readOnly = true)
    public void scheduledSync() {
        log.info("Running scheduled homestay sync");
        syncAllHomestays();
    }

    /**
     * Convert SQL Homestay entity to MongoDB document
     */
    private HomestayDocument convertToDocument(Homestay homestay) {
        LocalDateTime now = LocalDateTime.now();

        return HomestayDocument.builder()
                .idHomestay(homestay.getIdHomestay())
                .tenHomestay(homestay.getTenHomestay())
                .trangThai(homestay.getTrangThai())
                .hinhAnh(homestay.getHinhAnh())
                .moTa(homestay.getGioiThieu())
                .diaChi(homestay.getDiaChi())
                .soDienThoai("") // Not available in entity
                .giaTu(homestayService.caculateMinRoomPriceByHomestay(homestay)) // Calculate from rooms
                .giaDen(homestayService.caculateMaxRoomPriceByHomestay(homestay)) // Calculate from rooms
                .userId(homestay.getNguoiDung() != null ? homestay.getNguoiDung().getUserId() : null)
                .khuVuc(convertLocationInfo(homestay))
                .hostInfo(convertHostInfo(homestay))
                .rooms(convertRoomInfo(homestay))
                .amenities(convertAmenities(homestay))
                .policies(convertPolicies(homestay))
                .rating(convertRatingInfo(homestay))
                .lastSyncAt(now)
                .createdAt(homestay.getNgayTao())
                .updatedAt(now)
                .build();
    }

    /**
     * Convert location information
     */
    private HomestayDocument.LocationInfo convertLocationInfo(Homestay homestay) {
        try {
            if (homestay.getKhuVuc() == null) {
                return HomestayDocument.LocationInfo.builder()
                        .tenKhuVuc("Unknown")
                        .moTa("No location information")
                        .thanhPho("Việt Nam")
                        .quocGia("Việt Nam")
                        .build();
            }

            return HomestayDocument.LocationInfo.builder()
                    .tenKhuVuc(homestay.getKhuVuc().getTenKv() != null ? homestay.getKhuVuc().getTenKv() : "Unknown")
                    .moTa(homestay.getKhuVuc().getMota() != null ? homestay.getKhuVuc().getMota() : "")
                    .thanhPho("Việt Nam") // Default value
                    .quocGia("Việt Nam")
                    .build();

        } catch (Exception e) {
            log.warn("Error accessing location info for homestay {}: {}", homestay.getIdHomestay(), e.getMessage());
            return HomestayDocument.LocationInfo.builder()
                    .tenKhuVuc("Unknown")
                    .moTa("Location info unavailable")
                    .thanhPho("Việt Nam")
                    .quocGia("Việt Nam")
                    .build();
        }
    }

    /**
     * Convert host information
     */
    private HomestayDocument.HostInfo convertHostInfo(Homestay homestay) {
        if (homestay.getNguoiDung() == null) {
            return null;
        }

        return HomestayDocument.HostInfo.builder()
                .hostId(homestay.getNguoiDung().getUserId())
                .hostName(homestay.getNguoiDung().getUserName())
                .hostPhone(homestay.getNguoiDung().getPhoneNumber())
                .hostEmail(homestay.getNguoiDung().getEmail())
                .hostAvatar(homestay.getNguoiDung().getPicture())
                .build();
    }

    /**
     * Convert room information
     */
    private List<HomestayDocument.RoomInfo> convertRoomInfo(Homestay homestay) {
        if (homestay.getPhongs() == null || homestay.getPhongs().isEmpty()) {
            return new ArrayList<>();
        }

        return homestay.getPhongs().stream()
                .map(phong -> HomestayDocument.RoomInfo.builder()
                        .maPhong(phong.getMaPhong())
                        .tenPhong(phong.getTenPhong())
                        .tenLoaiPhong(phong.getLoaiPhong() != null ? phong.getLoaiPhong().getTenLoai() : "Standard")
                        .giaPhong(phong.getDonGia()) // Default price
                        .sucChua(phong.getSoNguoi()) // Default capacity
                        .moTa(phong.getLoaiPhong().getMoTa())
                        .hinhAnhChinh(phong.getHinhAnhPhongs() != null && !phong.getHinhAnhPhongs().isEmpty()
                                ? phong.getHinhAnhPhongs().get(0).getUrlAnh()
                                : "default-room.jpg")
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Convert amenities
     */
    private List<String> convertAmenities(Homestay homestay) {
        // Get real amenities from homestay rooms
        return homestayService.getHomestayAmenities(homestay);
    }

    /**
     * Convert policies
     */
    private HomestayDocument.PolicyInfo convertPolicies(Homestay homestay) {
        if (homestay.getChinhSachs() == null || homestay.getChinhSachs().isEmpty()) {
            return HomestayDocument.PolicyInfo.builder()
                    .nhanPhong("14:00")
                    .traPhong("12:00")
                    .huyPhong("Hủy miễn phí trước 24 giờ")
                    .khac("Không hút thuốc trong phòng")
                    .build();
        }

        var chinhSach = homestay.getChinhSachs().get(0);
        return HomestayDocument.PolicyInfo.builder()
                .nhanPhong(chinhSach.getNhanPhong())
                .traPhong(chinhSach.getTraPhong())
                .huyPhong(chinhSach.getHuyPhong())
                .khac(chinhSach.getBuaAn())
                .build();
    }

    /**
     * Convert rating information
     */
    private HomestayDocument.RatingInfo convertRatingInfo(Homestay homestay) {
        // This would require additional queries to calculate ratings
        // For now, return default values
        return HomestayDocument.RatingInfo.builder()
                .averageRating(4.0) // Default rating
                .totalReviews(0)
                .lastReviewAt(null)
                .build();
    }

    /**
     * Get sync status
     */
    public SyncStatus getSyncStatus() {
        try {
            long sqlCount = 0; // Would need implementation in repository
            long mongoCount = mongoHomestayRepository.count();

            return SyncStatus.builder()
                    .sqlServerCount(sqlCount)
                    .mongoDbCount(mongoCount)
                    .inSync(sqlCount == mongoCount)
                    .lastSyncTime(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("Error getting sync status", e);
            return SyncStatus.builder()
                    .sqlServerCount(0)
                    .mongoDbCount(0)
                    .inSync(false)
                    .lastSyncTime(LocalDateTime.now())
                    .error(e.getMessage())
                    .build();
        }
    }

    /**
     * Sync status information
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class SyncStatus {
        private long sqlServerCount;
        private long mongoDbCount;
        private boolean inSync;
        private LocalDateTime lastSyncTime;
        private String error;
    }
}