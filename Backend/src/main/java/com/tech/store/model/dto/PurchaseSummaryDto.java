package com.tech.store.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tech.store.util.OnCreate;
import com.tech.store.util.OnUpdate;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseSummaryDto {

    private Long id;

    private Long buyerId;

    private Long sellerId;

    private List<Long> productIds;

    private Timestamp purchaseDate;

    private Long amount;

    private BigDecimal price;

    private String currency;

    private Map<Long,Long> quantity;



}
