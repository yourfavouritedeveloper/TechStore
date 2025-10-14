package com.tech.store.service;

import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.repository.AccountRedisRepository;
import com.tech.store.dao.repository.AccountRepository;
import com.tech.store.exception.AccountNotFoundException;
import com.tech.store.mapper.AccountMapper;
import com.tech.store.model.dto.Account;
import com.tech.store.model.dto.AccountDto;
import com.tech.store.model.dto.LoginRequestDto;
import com.tech.store.model.dto.RegisterRequestDto;
import com.tech.store.model.enumeration.Status;
import com.tech.store.util.UpdateUtils;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.*;


@Service
@RequiredArgsConstructor
public class  AccountService {


    @Autowired
    private AuthenticationManager authenticationManager;

    private final JWTService jwtService;
    private final AccountRepository accountRepository;
    private final AccountRedisRepository accountRedisRepository;
    private final AccountMapper accountMapper;
    private final UpdateUtils updateUtils;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);


    @Transactional(readOnly = true)
    public AccountDto findById(Long id) {
        return accountRedisRepository.findById(id)
                .orElseGet(() -> {
                    AccountEntity accountEntity = accountRepository.findById(id)
                            .orElseThrow(() -> new AccountNotFoundException("Account not found"));

                    AccountDto accountDto = accountMapper.toAccountDto(accountEntity);
                    accountRedisRepository.save(accountEntity);
                    return accountDto;
                });
    }

    @Transactional(readOnly = true)
    public AccountDto findByName(String username) {
        return accountRedisRepository.findByUsername(username)
                .orElseGet(() -> {
                    AccountEntity accountEntity = accountRepository.findByUsername(username)
                            .orElseThrow(() -> new AccountNotFoundException("Account not found"));

                    AccountDto accountDto = accountMapper.toAccountDto(accountEntity);
                    accountRedisRepository.save(accountEntity);
                    return accountDto;
                });
    }

    @Transactional(readOnly = true)
    public List<AccountDto> findAll() {
        return accountRedisRepository.findAll()
                .orElseGet(() -> {
                    List<AccountEntity> accountEntities = accountRepository.findAll();

                    if (accountEntities.isEmpty()) {
                        throw new AccountNotFoundException("Account not found");
                    }

                    List<AccountDto> accountDtos = accountEntities.stream()
                            .map(accountMapper::toAccountDto).toList();

                    accountEntities.forEach(accountRedisRepository::save);

                    return accountDtos;
                });
    }

    @Transactional
    public AccountDto register(RegisterRequestDto registerRequestDto, String customerId) {
        AccountDto accountDto = accountMapper.toAccountDto(registerRequestDto);
        AccountEntity accountEntity = accountMapper.toAccountEntity(accountDto);
        accountEntity.setPassword(bCryptPasswordEncoder.encode(registerRequestDto.getPassword()));
        accountEntity.setCustomerId(customerId);
        accountRepository.save(accountEntity);
        return accountRedisRepository.save(accountEntity);
    }

    @Transactional
    public LoginRequestDto login(LoginRequestDto loginRequest) {
        return verify(loginRequest);
    }

    public LoginRequestDto verify(LoginRequestDto loginRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),loginRequest.getPassword()));

        if(authentication.isAuthenticated()) {

            return loginRequest;
        }
        throw new AccountNotFoundException("User not found");
    }



    @Transactional
    public AccountDto updateAccount(AccountDto accountDto) throws Exception {
        AccountEntity accountEntity = accountRepository.findById(accountDto.getId())
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        updateUtils.copyNonNullProperties(accountDto, accountEntity);
        accountRepository.save(accountEntity);
        return accountRedisRepository.save(accountEntity);
    }

    @Transactional
    public AccountDto changePassword(Long id, String password) throws Exception {
        AccountEntity accountEntity = accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        accountEntity.setPassword(bCryptPasswordEncoder.encode(password));
        accountRepository.save(accountEntity);
        return accountRedisRepository.save(accountEntity);
    }


    @Transactional
    public AccountDto delete(Long id) {
        AccountEntity accountEntity = accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));
        accountEntity.setStatus(Status.CLOSED);
        accountRepository.save(accountEntity);
        return accountRedisRepository.save(accountEntity);
    }

    @Transactional
    public String remove(Long id) {
        AccountEntity accountEntity = accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));
        accountRepository.delete(accountEntity);
        return accountRedisRepository.delete(accountEntity);
    }





}
