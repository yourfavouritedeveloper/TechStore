package com.tech.store.dao.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.tech.store.model.dto.ProductDto;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "purchases")
public class PurchaseEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer",nullable = false)
    private AccountEntity buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller",nullable = false)
    private AccountEntity seller;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product",nullable = false)
    private ProductEntity productEntity;

    @Column(name = "purchase_date",nullable = false)
    private LocalDateTime purchaseDate;

    @Column(name = "purchased_amount",nullable = false)
    private Long amount;
}
