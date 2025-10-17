package com.tech.store.service;


import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.entity.ProductEntity;
import com.tech.store.dao.repository.ProductRedisRepository;
import com.tech.store.dao.repository.ProductRepository;


import com.tech.store.exception.AccountNotFoundException;
import com.tech.store.exception.ProductNotFoundException;

import com.tech.store.mapper.ProductMapper;


import com.tech.store.model.dto.AccountDto;
import com.tech.store.model.dto.ProductDto;
import com.tech.store.model.enumeration.Status;
import com.tech.store.util.UpdateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.Map;



@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRedisRepository productRedisRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final UpdateUtils updateUtils;


    @Transactional(readOnly = true)
    public ProductDto findById(Long id) {
        return productRedisRepository.findById(id)
                .orElseGet(() -> {

                    ProductEntity productEntity = productRepository.findById(id)
                            .orElseThrow(() -> new ProductNotFoundException("Product not found."));

                    ProductDto productDto = productMapper.toProductDto(productEntity);
                    productRedisRepository.save(productEntity);
                    return productDto;

                });
    }

    @Transactional(readOnly = true)
        public ProductDto findByName(String name) {
            return productRedisRepository.findByName(name).orElseGet(() -> {

                ProductEntity productEntity = productRepository.findByName(name)
                        .orElseThrow( () -> new ProductNotFoundException("Product not found."));
                ProductDto productDto = productMapper.toProductDto(productEntity);
                productRedisRepository.save(productEntity);
                return productDto;
            });


    }


    @Transactional(readOnly = true)
    public List<ProductDto> findAll() {
        return productRedisRepository.findAll()
                .orElseGet(() -> {
                    List<ProductEntity> productEntities = productRepository.findAll();

                    if (productEntities.isEmpty()) {
                        throw new ProductNotFoundException("Product not found.");
                    }

                    List<ProductDto> productDtos = productEntities.stream()
                            .map(productMapper::toProductDto).toList();

                    productEntities.forEach(productRedisRepository::save);

                    return productDtos;
                });
    }

    @Transactional(readOnly = true)
    public List<ProductDto> findByAccount(AccountDto accountDto) {
        return productRepository.findByAccountId(accountDto.getId())
                .stream()
                .map(productMapper::toProductDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductDto> findByMostPopular() {
        List<ProductDto> productDtos = findAll();
        return productDtos.stream()
                .sorted(Comparator.comparing(ProductDto::getSearched).reversed())
                .limit(6)
                .toList();

    }

    @Transactional(readOnly = true)
    public List<ProductDto> findByMostBought() {
        List<ProductDto> productDtos = findAll();
        return productDtos.stream()
                .sorted(Comparator.comparing(ProductDto::getBought).reversed())
                .limit(6)
                .toList();
    }



    @Transactional
    public ProductDto create(ProductDto productDto) {
        ProductEntity productEntity = productMapper.toProductEntity(productDto);
        productRepository.save(productEntity);
        return productRedisRepository.save(productEntity);
    }

    @Transactional
    public ProductDto updateProduct(ProductDto productDto) throws Exception {
        ProductEntity productEntity = productMapper.toProductEntity(productDto);
        productRepository.save(productEntity);
        return productRedisRepository.save(productEntity);
    }

    @Transactional
    public ProductDto updateRating(Long productId, BigDecimal rating) throws Exception {
        ProductEntity productEntity = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found."));

        BigDecimal totalRating = productEntity.getRating().multiply(
                BigDecimal.valueOf(productEntity.getRatingCount())
        );

        productEntity.setRatingCount(productEntity.getRatingCount() + 1);

        BigDecimal newRating = totalRating.add(rating)
                .divide(BigDecimal.valueOf(productEntity.getRatingCount()), 2, RoundingMode.HALF_UP);

        productEntity.setRating(newRating);
        productRepository.save(productEntity);
        return productRedisRepository.save(productEntity);
    }

    @Transactional
    public ProductDto delete(Long id) {
        ProductEntity productEntity = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        productEntity.setStatus(Status.CLOSED);
        productRepository.save(productEntity);
        return productRedisRepository.save(productEntity);

    }

    @Transactional
    public String remove(Long id) {
        ProductEntity productEntity = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        productRepository.delete(productEntity);
        return productRedisRepository.delete(productEntity);
    }
}
