package com.tech.store.dao.entity;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.tech.store.model.dto.ProductSummaryDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "carts")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class CartEntity extends BaseEntity{



    @ManyToMany
    @JoinTable(
            name = "cart_products",
            joinColumns = @JoinColumn(name = "cart_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<ProductEntity> products;

    @Column(name = "total_price")
    private BigDecimal totalPrice = BigDecimal.ZERO;


    @ElementCollection
    @CollectionTable(name = "cart_product_amounts", joinColumns = @JoinColumn(name = "cart_id"))
    @MapKeyColumn(name = "product_id")
    @Column(name = "amount")
    private Map<Long,Long> amounts;



    @OneToOne
    @JoinColumn(name = "account_id")
    private AccountEntity account;
}
