package com.tech.store.mapper;

import com.tech.store.dao.entity.CartEntity;
import com.tech.store.model.dto.CartDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartMapper {

    CartDto toCartDto(CartEntity cartEntity);

    CartEntity toCartEntity(CartDto cartDto);
}
