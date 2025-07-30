package com.tech.store.dao.entity;

import com.tech.store.model.enumeration.Category;
import com.tech.store.util.NotBlankMap;
import com.tech.store.util.OnCreate;
import com.tech.store.util.OnUpdate;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.awt.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class ProductEntity extends BaseEntity {

    @Column(name = "name",nullable = false)
    private String name;

    @Column(name = "description",nullable = false)
    private String description;

    @Column(name = "price",nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(name = "category",nullable = false)
    private Category category;

    @Column(name = "company",nullable = false)
    private String company;

    @Column(name = "searched",nullable = false)
    private Integer searched = 0;

    @ElementCollection
    @CollectionTable(name = "product_properties", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "value")
    @MapKeyColumn(name = "key")
    private Map<String, String> properties;

    @Column(name = "weight")
    private BigDecimal weight;

    @Column(name = "height")
    private BigDecimal height;

    @Column(name = "width")
    private BigDecimal width;

    @Column(name = "volume")
    private BigDecimal volume;

    @Column(name = "amount")
    private Long amount;

    @Column(name = "guarantee",nullable = false)
    private Byte guarantee;

    @Column(name = "color")
    private String color;
}
