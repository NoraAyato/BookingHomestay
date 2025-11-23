package com.bookinghomestay.app.infrastructure.persistence.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * MongoDB document for Homestay data (synced from SQL Server)
 * Optimized for AI query performance
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "homestays")
public class HomestayDocument {

    @Id
    private String idHomestay;

    @Field("ten_homestay")
    private String tenHomestay;

    @Field("trang_thai")
    private String trangThai;

    @Field("hinh_anh")
    private String hinhAnh;

    @Field("mo_ta")
    private String moTa;

    @Field("dia_chi")
    private String diaChi;

    @Field("so_dien_thoai")
    private String soDienThoai;

    @Field("gia_tu")
    private BigDecimal giaTu;

    @Field("gia_den")
    private BigDecimal giaDen;

    @Field("khu_vuc")
    private LocationInfo khuVuc;

    @Field("user_id")
    private String userId; // Host ID

    @Field("host_info")
    private HostInfo hostInfo;

    @Field("rooms")
    private List<RoomInfo> rooms;

    @Field("amenities")
    private List<String> amenities;

    @Field("policies")
    private PolicyInfo policies;

    @Field("rating")
    private RatingInfo rating;

    // Metadata for sync
    @Field("last_sync_at")
    private LocalDateTime lastSyncAt;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    /**
     * Location information
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationInfo {
        private String tenKhuVuc;
        private String moTa;
        private String thanhPho;
        private String quocGia;
    }

    /**
     * Host information
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HostInfo {
        private String hostId;
        private String hostName;
        private String hostPhone;
        private String hostEmail;
        private String hostAvatar;
    }

    /**
     * Room information
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoomInfo {
        private String maPhong;
        private String tenPhong;
        private String tenLoaiPhong;
        private BigDecimal giaPhong;
        private Integer sucChua;
        private String moTa;
        private String hinhAnhChinh;
    }

    /**
     * Policy information
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PolicyInfo {
        private String nhanPhong;
        private String traPhong;
        private String huyPhong;
        private String khac;
    }

    /**
     * Rating information
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RatingInfo {
        private Double averageRating;
        private Integer totalReviews;
        private LocalDateTime lastReviewAt;
    }
}