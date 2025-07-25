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

import org.springframework.stereotype.Service;


import java.util.*;


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
        AccountEntity existingEntity = accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        ReflectionUpdater.updateFields(existingEntity, updates);

        AccountEntity savedEntity = accountRepository.save(existingEntity);

        return accountMapper.toAccountDto(savedEntity);

    }

    public AccountDto delete(Long id) {
        AccountEntity accountEntity = accountRepository
                .findById(id).orElseThrow(() -> new AccountNotFoundException("Account not found."));

        accountEntity.setStatus(Status.CLOSED);
        return accountMapper.toAccountDto(accountEntity);
    }

    public AccountDto remove(Long id) {
        AccountDto accountDto = findById(id);
        accountRepository.deleteById(id);
        return accountDto;
    }


}
