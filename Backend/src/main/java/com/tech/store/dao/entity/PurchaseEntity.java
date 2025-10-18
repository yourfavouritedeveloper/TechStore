package com.tech.store.dao.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.tech.store.model.dto.ProductDto;
import com.tech.store.util.OnCreate;
import com.tech.store.util.OnUpdate;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "purchases")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class PurchaseEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer",nullable = false)
    @JsonBackReference("buyer-purchases")
    private AccountEntity buyer;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "purchase_sellers",
            joinColumns = @JoinColumn(name = "purchase_id"),
            inverseJoinColumns = @JoinColumn(name = "seller_id")
    )
    @JsonBackReference("seller-purchases")
    private List<AccountEntity> sellers = new ArrayList<>();


    @ManyToMany
    @JoinTable(
            name = "purchase_products",
            joinColumns = @JoinColumn(name = "purchase_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    @JsonManagedReference("purchase-products")
    private List<ProductEntity> products = new ArrayList<>();


    @Column(name = "purchase_date",nullable = false, updatable = false)
    @CreationTimestamp
    private Timestamp purchaseDate;

    @Column(name = "total_amount",nullable = false)
    private Long amount;



    @ElementCollection
    @CollectionTable(
            name = "purchase_product_quantity",
            joinColumns = @JoinColumn(name = "purchase_id")
    )
    @MapKeyColumn(name = "product_id")
    @Column(name = "quantity")
    private Map<Long,Long> quantity;


    @Column(name = "currency", nullable = false)
    private String currency;


}
