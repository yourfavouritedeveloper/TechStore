package com.tech.store.mapper;

import com.tech.store.dao.entity.CommentEntity;
import com.tech.store.dao.entity.ProductEntity;
import com.tech.store.model.dto.CommentSummaryDto;
import com.tech.store.model.dto.ProductDto;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.math.BigDecimal;

@Mapper(componentModel = "spring", uses = {CommentMapper.class, AccountMapper.class, PurchaseMapper.class})
public interface ProductMapper {

    ProductDto toProductDto(ProductEntity productEntity);

    ProductEntity toProductEntity(ProductDto productDto);



}
