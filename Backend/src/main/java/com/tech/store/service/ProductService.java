package com.tech.store.service;

import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.entity.ProductEntity;
import com.tech.store.dao.repository.ProductRepository;
import com.tech.store.exception.AccountNotFoundException;
import com.tech.store.exception.MisMatchingDataException;
import com.tech.store.exception.ProductNotFoundException;
import com.tech.store.mapper.ProductMapper;
import com.tech.store.model.dto.AccountDto;
import com.tech.store.model.dto.ProductDto;
import com.tech.store.model.enumeration.Status;
import com.tech.store.util.ReflectionUpdater;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductDto findById(Long id) {
        return productMapper.toProductDto(productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException("Product not found.")));
    }

    public ProductDto findByName(String name) {
        return productMapper.toProductDto(productRepository.findByName(name).orElseThrow(() -> new ProductNotFoundException("Product not found.")));
    }

    public List<ProductDto> findAll() {
        List<ProductEntity> productEntities = productRepository.findAll();
        return productEntities.stream()
                .map(productMapper::toProductDto)
                .toList();
    }

    public ProductDto create(ProductDto productDto) {
        ProductEntity productEntity = productMapper.toProductEntity(productDto);
        return productMapper.toProductDto(productRepository.save(productEntity));
    }

    public ProductDto update(Long id, Map<String, String> updates) throws Exception {
        if(updates.isEmpty()) throw new MisMatchingDataException("Mismatching keys and/or values.");

        Class<ProductDto> productDtoClass = ProductDto.class;

        if(updates.size() > productDtoClass.getDeclaredFields().length) throw new MisMatchingDataException("More than required fields found.");

        ProductDto productDto = findById(id);
        ReflectionUpdater.updateFields(productDto,updates);

        ProductEntity productEntity = productMapper.toProductEntity(productDto);
        return productMapper.toProductDto(productRepository.save(productEntity));

    }

    public void delete(Long id) {
        ProductEntity productEntity = productRepository
                .findById(id).orElseThrow(() -> new AccountNotFoundException("Account not found."));

        productEntity.setStatus(Status.CLOSED);
        productRepository.save(productEntity);
    }

    public void remove(Long id) {
        ProductDto productDto = findById(id);
        productRepository.delete(productMapper.toProductEntity(productDto));
    }
}
