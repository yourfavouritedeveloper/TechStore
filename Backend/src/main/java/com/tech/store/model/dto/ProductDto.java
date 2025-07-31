package com.tech.store.model.dto;

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


import java.awt.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ProductDto {

    @NotBlank(message = "Name of the Product cannot be empty.", groups = {OnCreate.class, OnUpdate.class})
    private String name;

    @NotBlank(message = "Description cannot be empty.", groups = {OnCreate.class, OnUpdate.class})
    private String description;

    @NotNull(message = "Price cannot be empty.", groups = {OnCreate.class, OnUpdate.class})
    private BigDecimal price;

    @NotNull(message = "Define a category for the product.", groups = {OnCreate.class, OnUpdate.class})
    private Category category;

    @NotBlank(message = "Provide the company name.", groups = {OnCreate.class, OnUpdate.class})
    private String company;

    private Integer searched;

    private Integer bought;

    @JsonProperty("productImageUrl")
    private String productImageUrl;

    @NotBlankMap(message = "Properties map must have non-blank keys and values", groups = {OnCreate.class, OnUpdate.class})
    private Map<String, String> properties;

    private BigDecimal weight;

    private BigDecimal height;

    private BigDecimal width;

    private BigDecimal volume;

    @NotNull(message = "Product amount cannot be null.", groups = {OnCreate.class, OnUpdate.class})
    private Long amount;

    @NotNull(message = "Provide the guarantee", groups = {OnCreate.class, OnUpdate.class})
    private Byte guarantee;

    private String color;

}
