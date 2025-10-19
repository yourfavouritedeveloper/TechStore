package com.tech.store.dao.repository;

import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.mapper.AccountMapper;
import com.tech.store.model.dto.AccountDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository("accountRedisRepository")
@RequiredArgsConstructor
public class AccountRedisRepository {


    private final RedisTemplate<String, AccountDto> accountRedisTemplate;
    private final RedisTemplate<String,String> accountKeysRedisTemplate;
    private final AccountMapper accountMapper;

    private static final String KEY_PREFIX = "account:";
    private static final String ALL_KEYS_SET= "account:keys:";

    public Optional<AccountDto> findById(Long id) {
        String key = KEY_PREFIX + id;
        AccountDto accountDto = accountRedisTemplate.opsForValue().get(key);
        return Optional.ofNullable(accountDto);
    }

    public Optional<AccountDto> findByUsername(String username) {
        String key = KEY_PREFIX + username;
        AccountDto accountDto = accountRedisTemplate.opsForValue().get(key);
        return Optional.ofNullable(accountDto);
    }

    public Optional<AccountDto> findByEmail(String email) {
        String key = KEY_PREFIX + email;
        AccountDto accountDto = accountRedisTemplate.opsForValue().get(key);
        return Optional.ofNullable(accountDto);
    }


    public Optional<List<AccountDto>> findAll() {
        Set<String> keys = accountKeysRedisTemplate.opsForSet().members(ALL_KEYS_SET);
        if (keys == null || keys.isEmpty()) {
            return Optional.of(List.of());
        }
        List<AccountDto> accountDtos = accountRedisTemplate.opsForValue().multiGet(keys);
        return accountDtos != null ? Optional.of(accountDtos) : Optional.of(List.of());
    }

    public AccountDto save(AccountEntity accountEntity) {
        String key = KEY_PREFIX + accountEntity.getId();
        accountRedisTemplate.opsForValue().set(KEY_PREFIX,accountMapper.toAccountDto(accountEntity));
        accountKeysRedisTemplate.opsForSet().add(ALL_KEYS_SET,key);
        return accountMapper.toAccountDto(accountEntity);
    }

    public String delete(AccountEntity accountEntity) {
        String key = KEY_PREFIX + accountEntity.getId();
        accountKeysRedisTemplate.opsForSet().remove(ALL_KEYS_SET, key);
        accountRedisTemplate.delete(key);
        return "Deleted.";
    }
}
