package com.tech.store.dao.repository;

import com.tech.store.dao.entity.ProductEntity;
import com.tech.store.mapper.ProductMapper;
import com.tech.store.model.dto.ProductDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository("productRedisRepository")
@RequiredArgsConstructor
public class ProductRedisRepository{


    private final RedisTemplate<String, ProductDto> productRedisTemplate;
    private final RedisTemplate<String,String> productKeysRedisTemplate;
    private final ProductMapper productMapper;

    private static final String KEY_PREFIX = "product:";
    private static final String ALL_KEYS_SET = "product:keys";


    public Optional<ProductDto> findById(Long id) {
        String key = KEY_PREFIX + id;
        ProductDto productDto = productRedisTemplate.opsForValue().get(key);
        return Optional.ofNullable(productDto);
    }

    public Optional<ProductDto> findByName(String name) {
        String key = KEY_PREFIX + name;
        ProductDto productDto = productRedisTemplate.opsForValue().get(key);
        return Optional.ofNullable(productDto);
    }

    public Optional<List<ProductDto>> findAll() {
        Set<String> keys = productKeysRedisTemplate.opsForSet().members(ALL_KEYS_SET);
        if (keys == null || keys.isEmpty()) {
            return Optional.of(List.of());
        }
        List<ProductDto> products = productRedisTemplate.opsForValue().multiGet(keys);
        return products != null ? Optional.of(products) : Optional.of(List.of());
    }

    public ProductDto save(ProductEntity productEntity) {
        String key = KEY_PREFIX + productEntity.getId();
        productRedisTemplate.opsForValue().set(key,productMapper.toProductDto(productEntity) );
        productKeysRedisTemplate.opsForSet().add(ALL_KEYS_SET, key);
        return productMapper.toProductDto(productEntity);

    }

    public String delete(ProductEntity productEntity) {
        String key = KEY_PREFIX + productEntity.getId();
        productKeysRedisTemplate.opsForSet().remove(ALL_KEYS_SET, key);
        productRedisTemplate.delete(key);
        return "Deleted.";
    }
}
