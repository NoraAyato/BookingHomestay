package com.bookinghomestay.app.application.users.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HostDetailResponseDto {
    private String hostId;
    private String hostName;
    private String avatar;
    private double responeseRate;
    private double responeseTime;
    private Boolean isSuperHost;
    private String joined;
}
