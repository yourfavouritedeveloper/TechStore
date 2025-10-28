package com.tech.store.mapper;

import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.model.dto.AccountDto;
import com.tech.store.model.dto.RegisterRequestDto;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface AccountMapper {

    @Mapping(target = "updatedAt", expression = "java(convertToTimestamp(accountEntity.getUpdatedAt()))")
    AccountDto toAccountDto(AccountEntity accountEntity);

    default Timestamp convertToTimestamp(LocalDateTime localDateTime) {
        return localDateTime == null ? null : Timestamp.valueOf(localDateTime);
    }

    @Mapping(target = "updatedAt", expression = "java(convertToLocalDateTime(accountDto.getUpdatedAt()))")
    AccountEntity toAccountEntity(AccountDto accountDto);

    default LocalDateTime convertToLocalDateTime(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }

    AccountDto toAccountDto(RegisterRequestDto registerRequestDto);



}
