package com.tech.store.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tech.store.util.OnCreate;
import com.tech.store.util.OnUpdate;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor

public class PurchaseDto {


    @JsonIgnore
    private AccountDto account;


    @JsonIgnore
    private ProductDto product;

    @NotNull(message = "Purchase date must be provided", groups = {OnCreate.class, OnUpdate.class})
    private LocalDateTime purchaseDate;

    @NotNull(message = "Purchased item's amount cannot be null.", groups = {OnCreate.class, OnUpdate.class})
    private Long amount;
}
