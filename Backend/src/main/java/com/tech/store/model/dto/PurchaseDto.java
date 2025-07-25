package com.tech.store.model.dto;

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

    @Valid
    private ProductDto product;

    @NotNull(message = "Purchase date must be provided")
    private LocalDateTime purchaseDate;
}
