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

    private List<Long> sellerIds;

    private List<Long> productIds;

    private Timestamp purchaseDate;

    private Long amount;

    private Map<Long,Long> quantity;

    private String currency;

    private String purchaseCode;


}
