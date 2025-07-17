package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String name;
    public Role(Long id){
        this.id =id;
    }
    public Long getRoleId() {
        return this.id;
    }

    public void setRoleId(Long roleId) {
        this.id = roleId;
    }
    public String getRoleName(){
        return this.name;
    }
}

