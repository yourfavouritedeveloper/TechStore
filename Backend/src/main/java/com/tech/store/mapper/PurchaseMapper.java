package com.tech.store.mapper;

import com.tech.store.dao.entity.PurchaseEntity;
import com.tech.store.model.dto.PurchaseDto;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PurchaseMapper {

    PurchaseDto toPurchaseDto(PurchaseEntity purchaseEntity);

    PurchaseEntity toPurchaseEntity(PurchaseDto purchaseDto);
}
