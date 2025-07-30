package com.tech.store.service;

import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.repository.AccountRepository;
import com.tech.store.model.dto.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountDetailsService implements UserDetailsService {

    private final AccountRepository accountRepository;



    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        AccountEntity accountEntity = accountRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Account not found."));
        return new Account(accountEntity);
    }




}

