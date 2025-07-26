package com.tech.store.service;

import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.repository.AccountRepository;
import com.tech.store.exception.AccountNotFoundException;
import com.tech.store.exception.MisMatchingDataException;
import com.tech.store.mapper.AccountMapper;
import com.tech.store.model.dto.AccountDto;
import com.tech.store.model.enumeration.Status;
import com.tech.store.util.UpdateUtils;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.*;


@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;
    private final UpdateUtils updateUtils;

    @Transactional(readOnly = true)
    public AccountDto findById(Long id) {
        return accountMapper.toAccountDto(accountRepository.findById(id).orElseThrow(() -> new AccountNotFoundException("Account not found.")));
    }

    @Transactional(readOnly = true)
    public AccountDto findByName(String username) {
        return accountMapper.toAccountDto(accountRepository.findByUsername(username).orElseThrow(() -> new AccountNotFoundException("Account not found.")));
    }

    @Transactional(readOnly = true)
    public List<AccountDto> findAll() {
        List<AccountEntity> accountEntities = accountRepository.findAll();
        return accountEntities.stream()
                .map(accountMapper::toAccountDto)
                .toList();
    }

    @Transactional
    public AccountDto create(AccountDto accountDto) {
        AccountEntity accountEntity = accountMapper.toAccountEntity(accountDto);
        return accountMapper.toAccountDto(accountRepository.save(accountEntity));
    }

    @Transactional
    public AccountDto updateAccount(Long id, Map<String, String> updates) throws Exception {
        AccountEntity accountEntity = accountRepository.findById(id).orElseThrow(() -> new AccountNotFoundException("Account not found."));
        accountEntity = (AccountEntity) updateUtils.update(accountEntity,updates);

        AccountEntity saved = accountRepository.save(accountEntity);
        return accountMapper.toAccountDto(saved);
    }


    @Transactional
    public AccountDto delete(Long id) {
        AccountEntity accountEntity = accountRepository
                .findById(id).orElseThrow(() -> new AccountNotFoundException("Account not found."));

        accountEntity.setStatus(Status.CLOSED);
        AccountEntity saved = accountRepository.save(accountEntity);
        return accountMapper.toAccountDto(saved);
    }

    @Transactional
    public AccountDto remove(Long id) {
        AccountDto accountDto = findById(id);
        accountRepository.deleteById(id);
        return accountDto;
    }


}
