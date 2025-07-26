package com.tech.store.mapper;

import com.tech.store.dao.entity.PurchaseEntity;
import com.tech.store.model.dto.PurchaseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface PurchaseMapper {

    @Mapping(target = "account", ignore = true)
    @Mapping(target = "product", ignore = true)
    PurchaseDto toPurchaseDto(PurchaseEntity purchaseEntity);

    @Mapping(target = "account", ignore = true)
    @Mapping(target = "productEntity", ignore = true)
    PurchaseEntity toPurchaseEntity(PurchaseDto purchaseDto);

    default BigDecimal map(BigDecimal value) {
        return value;
    }

}
