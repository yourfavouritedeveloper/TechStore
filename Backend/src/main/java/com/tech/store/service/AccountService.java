package com.tech.store.service;

import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.repository.AccountRedisRepository;
import com.tech.store.dao.repository.AccountRepository;
import com.tech.store.exception.AccountNotFoundException;
import com.tech.store.mapper.AccountMapper;
import com.tech.store.model.dto.*;
import com.tech.store.model.enumeration.Status;
import com.tech.store.util.UpdateUtils;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.*;
import java.util.concurrent.ConcurrentHashMap;


@Service
@RequiredArgsConstructor
public class  AccountService {


    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final AccountRepository accountRepository;
    private final AccountRedisRepository accountRedisRepository;
    private final AccountMapper accountMapper;
    private final UpdateUtils updateUtils;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

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
    public AccountDto findByEmail(String email) {
        return accountRedisRepository.findByEmail(email)
                .orElseGet( () -> {
                            AccountEntity accountEntity = accountRepository.findByEmail(email)
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

    public void sendOtp(String email) throws MessagingException {

        String otp = emailService.generateOtp();
        otpStore.put(email, otp);
        emailService.sendOtp(email, otp);

    }

    @Transactional
    public boolean verifyOtp(String email, String requestOtp) {
        String storedOtp = otpStore.get(email);
        if (storedOtp == null || !storedOtp.equals(requestOtp)) {
            return false;
        }
        otpStore.remove(email);
        return true;


    }

    @Transactional
    public AccountDto register(@Valid RegisterRequestDto registerRequestDto, String customerId) {
        if(accountRepository.findByUsername(registerRequestDto.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        AccountDto accountDto = accountMapper.toAccountDto(registerRequestDto);
        AccountEntity accountEntity = accountMapper.toAccountEntity(accountDto);
        accountEntity.setPassword(bCryptPasswordEncoder.encode(registerRequestDto.getPassword()));
        accountEntity.setCustomerId(customerId);
        accountRepository.save(accountEntity);
        return accountRedisRepository.save(accountEntity);
    }

    @Transactional
    public LoginResponseDto login(@Valid LoginRequestDto loginRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            if (!auth.isAuthenticated()) throw new BadCredentialsException("Invalid credentials");

            AccountEntity user = accountRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            // JWT with roles as claim
            String token = jwtService.generateToken(user.getUsername());


            return new LoginResponseDto(token, loginRequest.getUsername());
        } catch (Exception e) {
            throw new BadCredentialsException("Authentication failed: " + e.getMessage());
        }
    }

    public LoginResponseDto verify(LoginRequestDto loginRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),loginRequest.getPassword()));

        if(authentication.isAuthenticated()) {

            String token = jwtService.generateToken(loginRequest.getUsername());
            return new LoginResponseDto(token, loginRequest.getUsername());
        }
        throw new AccountNotFoundException("User not found");
    }



    @Transactional
    public AccountDto updateAccount(@Valid AccountDto accountDto) throws Exception {
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
