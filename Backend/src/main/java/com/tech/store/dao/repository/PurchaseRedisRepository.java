package com.tech.store.dao.repository;

import com.tech.store.dao.entity.PurchaseEntity;
import com.tech.store.exception.PurchaseNotFoundException;
import com.tech.store.mapper.PurchaseMapper;
import com.tech.store.model.dto.AccountDto;
import com.tech.store.model.dto.PurchaseDto;
import com.tech.store.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository("purchaseRedisRepository")
@RequiredArgsConstructor
public class PurchaseRedisRepository {


    private final RedisTemplate<String, PurchaseDto> purchaseRedisTemplate;
    private final RedisTemplate<String, AccountDto> accountRedisTemplate;
    private final RedisTemplate<String, String> purchaseKeysRedisTemplate;
    private final PurchaseMapper purchaseMapper;

    private static final String KEY_PREFIX = "purchase:";
    private static final String ALL_KEYS_SET = "purchase:keys";

    public Optional<PurchaseDto> findById(Long id) {
        String key = KEY_PREFIX + id;
        PurchaseDto purchaseDto = purchaseRedisTemplate.opsForValue().get(key);
        return Optional.ofNullable(purchaseDto);
    }

    public Optional<List<PurchaseDto>> findByAccount(Long accountId) {
        String accountKey = KEY_PREFIX + accountId;
        AccountDto accountDto = accountRedisTemplate.opsForValue().get(accountKey);
        if (accountDto == null || accountDto.getPurchases() == null) {
            return Optional.empty();
        }


        return Optional.of(accountDto.getPurchases().stream()
                .map(purchaseSummaryDtos -> findById(purchaseSummaryDtos.getId())
                        .orElseThrow(() -> new PurchaseNotFoundException("Purchase not found")))
                .toList());

    }

    public Optional<List<PurchaseDto>> findAll() {
        Set<String> keys = purchaseKeysRedisTemplate.opsForSet().members(ALL_KEYS_SET);
        if(keys == null || keys.isEmpty()) {
            return Optional.of(List.of());
        }
        List<PurchaseDto> purchaseDtos = purchaseRedisTemplate.opsForValue().multiGet(keys);
        return purchaseDtos != null ? Optional.of(purchaseDtos) : Optional.of(List.of());
    }

    public PurchaseDto save(PurchaseEntity purchaseEntity) {
        String key = KEY_PREFIX + purchaseEntity.getId();
        purchaseRedisTemplate.opsForValue().set(key,purchaseMapper.toPurchaseDto(purchaseEntity));
        purchaseKeysRedisTemplate.opsForSet().add(ALL_KEYS_SET, key);
        return purchaseMapper.toPurchaseDto(purchaseEntity);
    }

    public String delete(PurchaseEntity purchaseEntity) {
        String key = KEY_PREFIX + purchaseEntity.getId();
        purchaseKeysRedisTemplate.opsForSet().remove(ALL_KEYS_SET, key);
        purchaseRedisTemplate.delete(key);
        return "Deleted.";
    }
}
