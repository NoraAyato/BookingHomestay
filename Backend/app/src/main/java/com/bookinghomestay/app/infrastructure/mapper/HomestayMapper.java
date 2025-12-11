package com.bookinghomestay.app.infrastructure.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.bookinghomestay.app.application.admin.homestay.dto.HomestayInfoResponseDto;
import com.bookinghomestay.app.application.homestay.dto.HomestayDetailResponseDto;
import com.bookinghomestay.app.application.homestay.dto.HomestayDichVuResponseDto;
import com.bookinghomestay.app.application.homestay.dto.HomestayImageResponseDto;
import com.bookinghomestay.app.application.homestay.dto.HomestayResponseDto;
import com.bookinghomestay.app.application.homestay.dto.HomestaySearchResponse;
import com.bookinghomestay.app.application.homestay.dto.HomestayTienNghiResponseDto;
import com.bookinghomestay.app.application.homestay.dto.HomestayTop5ResponeDto;
import com.bookinghomestay.app.application.homestay.dto.RoomAvailabilityDto;
import com.bookinghomestay.app.application.homestay.dto.RoomImagesDto;
import com.bookinghomestay.app.application.host.homestay.dto.HostHomestayDataResponseDto;
import com.bookinghomestay.app.application.host.service.dto.ServiceDataDto;
import com.bookinghomestay.app.application.users.dto.HostDetailResponseDto;
import com.bookinghomestay.app.domain.model.ChinhSach;
import com.bookinghomestay.app.domain.model.DanhGia;
import com.bookinghomestay.app.domain.model.DichVu;
import com.bookinghomestay.app.domain.model.HinhAnhPhong;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.Phong;

import java.math.BigDecimal;

public class HomestayMapper {

        /**
         * Chuyển đổi từ entity Homestay sang HomestayResponseDto
         */
        public static HomestayResponseDto toHomestayResponseDto(Homestay homestay) {
                return new HomestayResponseDto();
        }

        public static HomestayInfoResponseDto toHomestayInfoResponseDto(Homestay homestay, double rating,
                        int totalReviews, int totalRooms, int totalBookings, double revenue, double pricePerNight) {
                HomestayInfoResponseDto dto = new HomestayInfoResponseDto();
                dto.setId(homestay.getIdHomestay());
                dto.setName(homestay.getTenHomestay());
                dto.setLocation(homestay.getDiaChi() + ", " + homestay.getKhuVuc().getTenKv());
                dto.setHost(homestay.getNguoiDung() != null
                                ? homestay.getNguoiDung().getLastName() != null
                                                ? homestay.getNguoiDung().getLastName() + " "
                                                                + homestay.getNguoiDung().getFirstName()
                                                : homestay.getNguoiDung().getEmail()
                                : "");
                dto.setDescription(homestay.getGioiThieu());
                dto.setStatus(homestay.getTrangThai());
                dto.setRating(rating);
                dto.setReviews(totalReviews);
                dto.setRooms(totalRooms);
                dto.setPricePerNight(pricePerNight);
                dto.setTotalBookings(totalBookings);
                dto.setRevenue(revenue);
                dto.setHostEmail(homestay.getNguoiDung() != null ? homestay.getNguoiDung().getEmail() : "");
                dto.setImage(homestay.getHinhAnh());
                return dto;
        }

        public static HomestaySearchResponse toHomestaySearchResponse(Homestay homestay,
                        List<String> amenities, BigDecimal price, BigDecimal discountPrice, double rating,
                        boolean isNew, boolean isPopular) {
                HomestaySearchResponse response = new HomestaySearchResponse();
                response.setId(homestay.getIdHomestay());
                response.setTitle(homestay.getTenHomestay());
                response.setDescription(homestay.getGioiThieu());
                response.setLocation(homestay.getDiaChi() + ", " + homestay.getKhuVuc().getTenKv());
                response.setAddress(homestay.getDiaChi());
                response.setPrice(price != null ? price : BigDecimal.ZERO);
                response.setImage(homestay.getHinhAnh());
                response.setAmenities(amenities);
                response.setDiscountPrice(discountPrice);
                response.setRating(rating);
                response.setNew(isNew);
                response.setPopular(isPopular);
                response.setReviews(homestay.getDanhGias() != null ? homestay.getDanhGias().size() : 0);
                return response;

        }

        /**
         * Chuyển đổi từ entity Homestay sang HomestayDetailResponseDto
         */
        public static HomestayDetailResponseDto toHomestayDetailResponseDto(
                        Homestay homestay, int totalReviews, double rating, BigDecimal price,
                        BigDecimal bestDiscountPrice, List<String> amenities, List<String> images, boolean isNew,
                        boolean isFeatured, HostDetailResponseDto host) {

                ChinhSach chinhSach = homestay.getChinhSachs().stream().findFirst()
                                .orElseThrow(() -> new RuntimeException("Không có chính sách cho homestay"));

                return HomestayDetailResponseDto.builder()
                                .id(homestay.getIdHomestay())
                                .title(homestay.getTenHomestay())
                                .description(homestay.getGioiThieu())
                                .location(homestay.getDiaChi() + ", " + homestay.getKhuVuc().getTenKv())
                                .address(homestay.getDiaChi())
                                .price(price != null ? price.toString() : "0")
                                .reviews(totalReviews)
                                .rating(rating)
                                .images(images)
                                .amenities(amenities)
                                .isFeatured(isFeatured)
                                .isNew(isNew)
                                .host(host)
                                .discountPrice(bestDiscountPrice != null ? bestDiscountPrice.toString() : "0")
                                .policies(PoliciesMapper.toPoliciesResponseDto(chinhSach))
                                .build();
        }

        /**
         * Chuyển đổi từ entity Homestay sang HomestayImageResponseDto
         */
        public static HomestayImageResponseDto toHomestayImageResponseDto(Homestay homestay) {
                List<String> roomImages = homestay.getPhongs().stream()
                                .flatMap(phong -> phong.getHinhAnhPhongs().stream())
                                .map(HinhAnhPhong::getUrlAnh)
                                .collect(Collectors.toList());

                return new HomestayImageResponseDto(
                                homestay.getIdHomestay(),
                                homestay.getHinhAnh(),
                                roomImages);
        }

        public static HomestayTop5ResponeDto toHomestayTop5ResponseDto(Homestay homestay, BigDecimal price) {
                HomestayTop5ResponeDto dto = new HomestayTop5ResponeDto();
                dto.setId(homestay.getIdHomestay());
                dto.setTitle(homestay.getTenHomestay());
                dto.setLocation(homestay.getDiaChi() + "," + homestay.getKhuVuc().getTenKv());
                dto.setPrice(price); // homestay.getPricePerNight() != null ?
                // homestay.getPricePerNight() : BigDecimal.ZERO);
                dto.setImage(homestay.getHinhAnh());

                List<DanhGia> danhGias = homestay.getDanhGias();
                double averageRating = danhGias.isEmpty() ? 0.0
                                : danhGias.stream()
                                                .mapToDouble(dg -> (dg.getSachSe() + dg.getTienIch()
                                                                + dg.getDichVu()) / 3.0)
                                                .average()
                                                .orElse(0.0);
                dto.setRating(Math.floor(averageRating * 10) / 10);
                dto.setReviews(danhGias.size());

                return dto;
        }

        /**
         * Chuyển đổi từ entity Homestay sang HomestayTienNghiResponseDto
         */
        public static HomestayTienNghiResponseDto toHomestayTienNghiResponseDto(Homestay homestay) {
                List<HomestayTienNghiResponseDto.TienNghiDto> tienNghiDtos = homestay.getPhongs().stream()
                                .flatMap(phong -> phong.getChiTietPhongs().stream())
                                .collect(Collectors.toMap(
                                                chiTiet -> chiTiet.getTienNghi().getMaTienNghi(),
                                                chiTiet -> new HomestayTienNghiResponseDto.TienNghiDto(
                                                                chiTiet.getTienNghi().getMaTienNghi(),
                                                                chiTiet.getTienNghi().getTenTienNghi(),
                                                                chiTiet.getTienNghi().getMoTa(),
                                                                chiTiet.getSoLuong()),
                                                (existing, replacement) -> {
                                                        existing.setSoLuong(existing.getSoLuong()
                                                                        + replacement.getSoLuong());
                                                        return existing;
                                                }))
                                .values().stream()
                                .collect(Collectors.toList());

                return new HomestayTienNghiResponseDto(homestay.getIdHomestay(), tienNghiDtos);
        }

        /**
         * Chuyển đổi từ entity DichVu sang DichVuDto
         */
        public static HomestayDichVuResponseDto toServiceDto(DichVu dichVu) {
                return new HomestayDichVuResponseDto(
                                dichVu.getMaDV(),
                                dichVu.getTenDV(),
                                dichVu.getMoTa(),
                                dichVu.getDonGia(),
                                dichVu.getHinhAnh());
        }

        /**
         * Chuyển đổi từ entity Phong sang RoomAvailabilityDto
         */
        public static RoomAvailabilityDto toRoomAvailabilityDto(Phong phong, BigDecimal discountPrice) {
                return new RoomAvailabilityDto();
        }

        /**
         * Chuyển đổi từ entity Phong sang RoomImagesDto
         */
        public static RoomImagesDto toRoomImagesDto(Phong phong) {
                return new RoomImagesDto(
                                phong.getMaPhong(),
                                phong.getHinhAnhPhongs().stream()
                                                .map(HinhAnhPhong::getUrlAnh)
                                                .collect(Collectors.toList()));
        }

        public static HostHomestayDataResponseDto toHostHomestayDataResponseDto(Homestay homestay, double averageRating,
                        int totalReviews, int totalBookings, int revenue, int availableRooms, List<String> amenities,
                        List<ServiceDataDto> services) {
                HostHomestayDataResponseDto dto = new HostHomestayDataResponseDto();
                dto.setId(homestay.getIdHomestay());
                dto.setName(homestay.getTenHomestay());
                dto.setLocationId(homestay.getKhuVuc().getMaKv());
                dto.setLocation(homestay.getDiaChi() + ", " + homestay.getKhuVuc().getTenKv());
                dto.setAddress(homestay.getDiaChi());
                dto.setDescription(homestay.getGioiThieu());
                dto.setStatus(homestay.getTrangThai());
                dto.setImage(homestay.getHinhAnh());
                dto.setRating(averageRating);
                dto.setReviews(totalReviews);
                dto.setRevenue(revenue);
                dto.setTotalBookings(totalBookings);
                dto.setCreatedAt(homestay.getNgayTao().toLocalDate());
                dto.setAmenities(amenities);
                dto.setServices(services);
                dto.setAvailableRooms(availableRooms);
                return dto;
        }
}
