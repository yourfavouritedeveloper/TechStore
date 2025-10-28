package com.tech.store.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.entity.CartEntity;
import com.tech.store.dao.entity.RefreshToken;
import com.tech.store.dao.repository.*;
import com.tech.store.exception.AccountNotFoundException;
import com.tech.store.exception.CartNotFoundException;
import com.tech.store.exception.RefreshTokenExpiredException;
import com.tech.store.exception.RefreshTokenNotFoundException;
import com.tech.store.mapper.AccountMapper;
import com.tech.store.model.dto.*;
import com.tech.store.model.enumeration.Role;
import com.tech.store.model.enumeration.Status;
import com.tech.store.util.UpdateUtils;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpHeaders;


import java.io.IOException;
import java.sql.Ref;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;


@Service
@RequiredArgsConstructor
public class  AccountService {

    private final CartService cartService;
    private final CartRepository cartRepository;
    private final CartRedisRepository cartRedisRepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AccountRepository accountRepository;
    private final AccountRedisRepository accountRedisRepository;
    private final AccountMapper accountMapper;
    private final UpdateUtils updateUtils;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    public boolean isAvailableUsername(String username) {
        List<AccountEntity> accountEntities = accountRepository.findAll();
        for (AccountEntity accountEntity : accountEntities) {
            if (accountEntity.getUsername().equals(username)) {
                return false;
            }
        }
        return true;
    }

    public boolean isAvailableEmail(String email) {
        List<AccountEntity> accountEntities = accountRepository.findAll();
        for (AccountEntity accountEntity : accountEntities) {
            if (accountEntity.getEmail().equals(email)) {
                return false;
            }
        }
        return true;
    }

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

    public void sendOtp(String email) throws MessagingException, IOException {

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
        accountEntity.setRole(Role.USER);
        accountEntity.setPassword(bCryptPasswordEncoder.encode(registerRequestDto.getPassword()));
        accountEntity.setCustomerId(customerId);

        accountRepository.save(accountEntity);

        CartDto cartDto = new CartDto();
        AccountSummaryDto accountSummaryDto = new AccountSummaryDto();
        accountSummaryDto.setUsername(accountEntity.getUsername());
        accountSummaryDto.setEmail(accountEntity.getEmail());
        accountSummaryDto.setCustomerName(accountEntity.getCustomerName());
        accountSummaryDto.setId(accountEntity.getId());
        cartDto.setAccount(accountSummaryDto);
        cartService.create(cartDto);

        return accountRedisRepository.save(accountEntity);
    }

    @Transactional
    public AuthResponseDto login(@Valid AuthRequestDto authRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );

            if (!auth.isAuthenticated()) throw new BadCredentialsException("Invalid credentials");

            AccountEntity user = accountRepository.findByUsername(authRequest.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            // JWT with roles as claim
            String token = jwtService.generateToken(user.getUsername());
            RefreshToken refreshToken = jwtService.generateRefreshToken(user.getUsername());


            return new AuthResponseDto(token, refreshToken.getToken(), authRequest.getUsername());
        } catch (Exception e) {
            throw new BadCredentialsException("Authentication failed: " + e.getMessage());
        }
    }

    public AuthResponseDto verify(AuthRequestDto authRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername(),authRequest.getPassword()));

        if(authentication.isAuthenticated()) {

            String token = jwtService.generateToken(authRequest.getUsername());
            RefreshToken refreshToken = jwtService.generateRefreshToken(authRequest.getUsername());
            return new AuthResponseDto(token, refreshToken.getToken(), authRequest.getUsername());
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
        CartEntity cartEntity = cartRepository.findById(accountEntity.getCart().getId())
                .orElseThrow(() -> new CartNotFoundException("Cart not found"));
        cartRepository.delete(cartEntity);
        cartRedisRepository.delete(cartEntity);
        accountRepository.delete(accountEntity);
        return accountRedisRepository.delete(accountEntity);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }


    public RefreshToken verifyRefreshToken(RefreshToken refreshToken) {
        if(refreshToken.getExpiresAt().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(refreshToken);
            throw new RefreshTokenExpiredException("Refresh token expired");
        }
        return refreshToken;
    }
}
