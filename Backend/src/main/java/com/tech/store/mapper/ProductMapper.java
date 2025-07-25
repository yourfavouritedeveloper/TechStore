package com.tech.store.mapper;

import com.tech.store.dao.entity.ProductEntity;
import com.tech.store.model.dto.ProductDto;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {

    ProductDto toProductDto(ProductEntity productEntity);

    ProductEntity toProductEntity(ProductDto productDto);
}
