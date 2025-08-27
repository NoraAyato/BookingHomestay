package com.bookinghomestay.app.infrastructure.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.bookinghomestay.app.api.dto.homestay.HomestayResponseDto;
import com.bookinghomestay.app.api.dto.homestay.HomestayDetailResponseDto;
import com.bookinghomestay.app.api.dto.homestay.HomestayDichVuResponseDto;
import com.bookinghomestay.app.api.dto.homestay.HomestayImageResponseDto;
import com.bookinghomestay.app.api.dto.homestay.HomestayTienNghiResponseDto;
import com.bookinghomestay.app.api.dto.homestay.HomestayTop5ResponeDto;
import com.bookinghomestay.app.api.dto.homestay.RoomAvailabilityDto;
import com.bookinghomestay.app.api.dto.homestay.RoomImagesDto;
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
                return new HomestayResponseDto(
                                homestay.getIdHomestay(),
                                homestay.getTenHomestay(),
                                homestay.getHinhAnh(),
                                homestay.getPricePerNight(),
                                homestay.getDiaChi(),
                                homestay.getHang());
        }

        /**
         * Chuyển đổi từ entity Homestay sang HomestayDetailResponseDto
         */
        public static HomestayDetailResponseDto toHomestayDetailResponseDto(
                        Homestay homestay, int tongDanhGia, double diemTrungBinh) {

                ChinhSach chinhSach = homestay.getChinhSachs().stream().findFirst()
                                .orElseThrow(() -> new RuntimeException("Không có chính sách cho homestay"));

                return HomestayDetailResponseDto.builder()
                                .id(homestay.getIdHomestay())
                                .tenHomestay(homestay.getTenHomestay())
                                .diaChi(homestay.getDiaChi())
                                .gioiThieu(homestay.getGioiThieu())
                                .tongDanhGia(tongDanhGia)
                                .diemHaiLongTrungBinh(diemTrungBinh)
                                .giaTien(homestay.getPricePerNight())
                                .hang(homestay.getHang() != null ? homestay.getHang() : BigDecimal.ZERO)
                                .chinhSach(
                                                HomestayDetailResponseDto.ChinhSachDto.builder()
                                                                .nhanPhong(chinhSach.getNhanPhong())
                                                                .traPhong(chinhSach.getTraPhong())
                                                                .huyPhong(chinhSach.getHuyPhong())
                                                                .buaAn(chinhSach.getBuaAn())
                                                                .build())
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

        public static HomestayTop5ResponeDto toHomestayTop5ResponseDto(Homestay homestay) {
                HomestayTop5ResponeDto dto = new HomestayTop5ResponeDto();
                dto.setId(homestay.getIdHomestay());
                dto.setTitle(homestay.getTenHomestay());
                dto.setLocation(homestay.getDiaChi() + "," + homestay.getKhuVuc().getTenKv());
                dto.setPrice(homestay.getPricePerNight() != null ? homestay.getPricePerNight().doubleValue() : null);
                dto.setImage(homestay.getHinhAnh());

                List<DanhGia> danhGias = homestay.getDanhGias();
                // double averageRating = danhGias.isEmpty() ? 0.0
                // : danhGias.stream()
                // .mapToDouble(dg -> (dg.getHaiLong() + dg.getSachSe() + dg.getTienIch()
                // + dg.getDichVu()) / 4.0)
                // .average()
                // .orElse(0.0);
                dto.setRating(homestay.getHang() != null ? homestay.getHang().doubleValue() : 0.0);
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
         * Chuyển đổi từ entity Homestay sang HomestayDichVuResponseDto
         */
        public static HomestayDichVuResponseDto toHomestayDichVuResponseDto(Homestay homestay) {
                List<HomestayDichVuResponseDto.DichVuDto> dichVuDtos = homestay.getDichVus().stream()
                                .map(dv -> toDichVuDto(dv))
                                .collect(Collectors.toList());

                return new HomestayDichVuResponseDto(homestay.getIdHomestay(), dichVuDtos);
        }

        /**
         * Chuyển đổi từ entity DichVu sang DichVuDto
         */
        public static HomestayDichVuResponseDto.DichVuDto toDichVuDto(DichVu dichVu) {
                return new HomestayDichVuResponseDto.DichVuDto(
                                dichVu.getMaDV(),
                                dichVu.getTenDV(),
                                dichVu.getDonGia(),
                                dichVu.getHinhAnh());
        }

        /**
         * Chuyển đổi từ entity Phong sang RoomAvailabilityDto
         */
        public static RoomAvailabilityDto toRoomAvailabilityDto(Phong phong) {
                return new RoomAvailabilityDto(
                                phong.getMaPhong(),
                                phong.getTenPhong(),
                                phong.getDonGia());
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
}
