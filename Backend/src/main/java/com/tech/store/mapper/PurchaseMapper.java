package com.tech.store.mapper;

import com.tech.store.dao.entity.ProductEntity;
import com.tech.store.dao.entity.PurchaseEntity;
import com.tech.store.model.dto.PurchaseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface PurchaseMapper {

    @Mapping(target = "buyerId", source = "buyer.id")
    @Mapping(target = "sellerId", source = "seller.id")
    @Mapping(target = "productIds", expression = "java(mapProductsToIds(purchaseEntity.getProducts()))")
    PurchaseDto toPurchaseDto(PurchaseEntity purchaseEntity);

    @Mapping(target = "buyer", ignore = true)
    @Mapping(target = "seller", ignore = true)
    @Mapping(target = "products", ignore = true)
    PurchaseEntity toPurchaseEntity(PurchaseDto purchaseDto);

    default BigDecimal map(BigDecimal value) {
        return value;
    }

    default List<Long> mapProductsToIds(List<ProductEntity> products) {
        if (products == null) {
            return null;
        }
        return products.stream()
                .map(ProductEntity::getId)
                .collect(Collectors.toList());
    }





}
