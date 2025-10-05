package com.tech.store.dao.repository;


import com.tech.store.dao.entity.CartEntity;
import com.tech.store.mapper.CartMapper;
import com.tech.store.model.dto.CartDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository("cartRedisRepository")
@RequiredArgsConstructor
public class CartRedisRepository {

    private final RedisTemplate<String, CartDto> cartRedisTemplate;
    private final RedisTemplate<String,String> cartKeysRedisTemplate;
    private final CartMapper cartMapper;

    private static final String KEY_PREFIX = "cart:";
    private static final String ALL_KEYS_SET= "cart:keys:";

    public Optional<CartDto> findById(Long id) {
        String key = KEY_PREFIX + id;
        CartDto cartDto = cartRedisTemplate.opsForValue().get(key);
        return Optional.ofNullable(cartDto);
    }

    public Optional<CartDto> findByAccount(Long accountId) {
        String key = KEY_PREFIX + "account:" + accountId;
        CartDto cartDto = cartRedisTemplate.opsForValue().get(key);
        return Optional.ofNullable(cartDto);
    }

    public Optional<List<CartDto>> findAll() {
        Set<String> keys = cartKeysRedisTemplate.opsForSet().members(ALL_KEYS_SET);
        if (keys == null || keys.isEmpty()) {
            return Optional.of(List.of());
        }
        List<CartDto> cartDtos = cartRedisTemplate.opsForValue().multiGet(keys);
        return cartDtos != null ? Optional.of(cartDtos) : Optional.of(List.of());
    }

    public CartDto save(CartEntity cartEntity) {
        String key = KEY_PREFIX + cartEntity.getId();
        cartRedisTemplate.opsForValue().set(KEY_PREFIX,cartMapper.toCartDto(cartEntity));
        cartKeysRedisTemplate.opsForSet().add(ALL_KEYS_SET,key);
        return cartMapper.toCartDto(cartEntity);
    }

    public String delete(CartEntity cartEntity) {
        String key = KEY_PREFIX + cartEntity.getId();
        cartKeysRedisTemplate.opsForSet().remove(ALL_KEYS_SET, key);
        cartRedisTemplate.delete(key);
        return "Deleted.";
    }


}
