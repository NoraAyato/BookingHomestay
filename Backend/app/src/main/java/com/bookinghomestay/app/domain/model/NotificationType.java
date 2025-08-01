package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notification_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type_name", columnDefinition = "nvarchar(20)", length = 20)
    private String typeName;
}
