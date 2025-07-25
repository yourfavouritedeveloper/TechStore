package com.tech.store.mapper;

import com.tech.store.dao.entity.PurchaseEntity;
import com.tech.store.model.dto.PurchaseDto;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface PurchaseMapper {

    PurchaseDto toPurchaseDto(PurchaseEntity purchaseEntity);

    PurchaseEntity toPurchaseEntity(PurchaseDto purchaseDto);

    default BigDecimal map(BigDecimal value) {
        return value;
    }
}
