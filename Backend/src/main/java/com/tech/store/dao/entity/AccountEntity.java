package com.tech.store.dao.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.tech.store.model.dto.PurchaseDto;
import com.tech.store.model.enumeration.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "accounts")
public class AccountEntity extends BaseEntity {

    private Role role;

    @Column(name = "username",nullable = false,unique = true)
    private String username;

    @Column(name = "customer_name",nullable = false)
    private String customerName;

    @Column(name = "password",nullable = false)
    private String password;

    @Column(name = "email",nullable = false)
    private String email;

    @Column(name = "balance",nullable = false)
    private BigDecimal balance;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PurchaseEntity> purchases;
}
