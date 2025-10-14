package com.tech.store.model.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import com.tech.store.util.OnCreate;
import com.tech.store.util.OnUpdate;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Data
@NoArgsConstructor
@AllArgsConstructor

public class PurchaseDto {

    private Long id;

    private Long buyerId;

    private Long sellerId;

    private List<Long> productIds;

    @NotNull(message = "Purchase date must be provided", groups = {OnCreate.class, OnUpdate.class})
    private Timestamp purchaseDate;

    @NotNull(message = "Purchased item's price Amount cannot be null.", groups = {OnCreate.class, OnUpdate.class})
    private Long amount;

    private Map<Long,Long> quantity;

    private String currency;

}
