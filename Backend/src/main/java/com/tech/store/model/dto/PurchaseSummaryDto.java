package com.tech.store.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tech.store.util.OnCreate;
import com.tech.store.util.OnUpdate;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseSummaryDto {

    private Long id;

    private AccountSummaryDto buyer;

    private AccountSummaryDto seller;

    private Long productId;

    private LocalDateTime purchaseDate;

    private Long amount;
}
