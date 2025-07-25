package com.tech.store.mapper;

import com.tech.store.dao.entity.ProductEntity;
import com.tech.store.model.dto.ProductDto;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductDto toProductDto(ProductEntity productEntity);

    ProductEntity toProductEntity(ProductDto productDto);

    default BigDecimal map(BigDecimal value) {
        return value;
    }
}
