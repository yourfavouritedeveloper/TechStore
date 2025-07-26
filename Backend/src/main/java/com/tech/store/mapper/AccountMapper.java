package com.tech.store.mapper;

import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.model.dto.AccountDto;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface AccountMapper {


    AccountDto toAccountDto(AccountEntity accountEntity);


    AccountEntity toAccountEntity(AccountDto accountDto);



}
