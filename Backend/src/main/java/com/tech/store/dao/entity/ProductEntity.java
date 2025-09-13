package com.tech.store.dao.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.tech.store.model.dto.AccountDto;
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
import org.springframework.data.redis.core.RedisHash;

import java.awt.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
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

    @Column(name = "searched")
    private Integer searched = 0;

    @Column(name = "bought")
    private Integer bought = 0;

    @Column(name = "product_image_url")
    private String productImageUrl;

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

    @Column(name = "rating")
    private BigDecimal rating;

    @Column(name = "discount")
    private Integer discount;

    @Column(name = "amount")
    private Long amount;

    @Column(name = "guarantee",nullable = false)
    private Byte guarantee;

    @Column(name = "color")
    private String color;

    @Column(name = "video_url")
    private String videoUrl;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("product-comments")
    private List<CommentEntity> comments;

    @OneToMany(mappedBy = "productEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("product-purchases")
    private List<PurchaseEntity> purchases;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account")
    @JsonBackReference("account-products")
    private AccountEntity account;
}
