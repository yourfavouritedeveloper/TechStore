package com.tech.store.service;

import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.repository.AccountRepository;
import com.tech.store.exception.AccountNotFoundException;
import com.tech.store.exception.MisMatchingDataException;
import com.tech.store.mapper.AccountMapper;
import com.tech.store.model.dto.AccountDto;
import com.tech.store.model.enumeration.Status;
import com.tech.store.util.ReflectionUpdater;
import lombok.RequiredArgsConstructor;
import org.aspectj.util.Reflection;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;

    public AccountDto findById(Long id) {
        return accountMapper.toAccountDto(accountRepository.findById(id).orElseThrow(() -> new AccountNotFoundException("Account not found.")));
    }

    public AccountDto findByName(String username) {
        return accountMapper.toAccountDto(accountRepository.findByUsername(username).orElseThrow(() -> new AccountNotFoundException("Account not found.")));
    }

    public List<AccountDto> findAll() {
        List<AccountEntity> accountEntities = accountRepository.findAll();
        return accountEntities.stream()
                .map(accountMapper::toAccountDto)
                .toList();
    }

    public AccountDto create(AccountDto accountDto) {
        AccountEntity accountEntity = accountMapper.toAccountEntity(accountDto);
        return accountMapper.toAccountDto(accountRepository.save(accountEntity));
    }

    public AccountDto update(Long id, Map<String, String> updates) throws Exception {
        if(updates.isEmpty()) throw new MisMatchingDataException("Mismatching keys and/or values.");

        Class<AccountDto> accountDtoClass = AccountDto.class;

        if(updates.size() > accountDtoClass.getDeclaredFields().length) throw new MisMatchingDataException("More than required fields found.");

        AccountDto accountDto = findById(id);
        ReflectionUpdater.updateFields(accountDto,updates);

        AccountEntity accountEntity = accountMapper.toAccountEntity(accountDto);
        return accountMapper.toAccountDto(accountRepository.save(accountEntity));

    }

    public void delete(Long id) {
        AccountEntity accountEntity = accountRepository
                .findById(id).orElseThrow(() -> new AccountNotFoundException("Account not found."));

        accountEntity.setStatus(Status.CLOSED);
        accountRepository.save(accountEntity);
    }

    public void remove(Long id) {
        AccountDto accountDto = findById(id);
        accountRepository.delete(accountMapper.toAccountEntity(accountDto));
    }


}
