package com.tech.store.dao.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class AccountEntity extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "username",nullable = false,unique = true)
    private String username;

    @Column(name = "customer_name",nullable = false)
    private String customerName;

    @Column(name = "description")
    private String description;

    @Column(name = "password",nullable = false)
    private String password;

    @Column(name = "email",nullable = false)
    private String email;

    @Column(name = "balance",nullable = false)
    private BigDecimal balance;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;


    @OneToMany(mappedBy = "buyer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("buyer-purchases")
    private List<PurchaseEntity> purchases;

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("seller-purchases")
    private List<PurchaseEntity> sells;

    @OneToMany(mappedBy = "fromAccount", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("account-sent-comments")
    private List<CommentEntity> sentComments;

    @OneToMany(mappedBy = "toAccount", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("account-received-comments")
    private List<CommentEntity> receivedComments;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("account-products")
    private List<ProductEntity> products;
}
