package com.tech.store.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.tech.store.model.enumeration.Category;
import com.tech.store.util.NotBlankMap;
import com.tech.store.util.OnCreate;
import com.tech.store.util.OnUpdate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryDto {

    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private Category category;

    private String company;

    private Integer searched;

    private Integer bought;

    private String productImageUrl;

    private Map<String, String> properties;

    private BigDecimal weight;

    private BigDecimal height;

    private BigDecimal width;

    private BigDecimal volume;

    private BigDecimal rating;

    private Integer discount;

    private Long amount;

    private Byte guarantee;

    private String color;

    private List<CommentSummaryDto> comments;

    private List<PurchaseSummaryDto> purchases;

    private AccountSummaryDto account;
}
