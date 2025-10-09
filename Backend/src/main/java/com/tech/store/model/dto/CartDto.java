package com.tech.store.model.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDto {

    private Long id;

    private AccountSummaryDto account;

    private List<ProductSummaryDto> products;

    private BigDecimal totalPrice;

    private Map<Long,Long> amounts;

}
