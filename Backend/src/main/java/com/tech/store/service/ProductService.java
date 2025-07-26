package com.tech.store.service;


import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.entity.ProductEntity;
import com.tech.store.dao.repository.ProductRepository;


import com.tech.store.exception.ProductNotFoundException;

import com.tech.store.mapper.ProductMapper;


import com.tech.store.model.dto.ProductDto;
import com.tech.store.model.enumeration.Status;
import com.tech.store.util.UpdateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final UpdateUtils updateUtils;

    @Transactional(readOnly = true)
    public ProductDto findById(Long id) {
        return productMapper.toProductDto(productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException("Product not found.")));
    }


    @Transactional(readOnly = true)
    public List<ProductDto> findAll() {
        List<ProductEntity> productEntities = productRepository.findAll();
        return productEntities.stream()
                .map(productMapper::toProductDto)
                .toList();
    }

    @Transactional
    public ProductDto create(ProductDto productDto) {
        ProductEntity productEntity = productMapper.toProductEntity(productDto);
        return productMapper.toProductDto(productRepository.save(productEntity));
    }

    @Transactional
    public ProductDto updateProduct(Long id, Map<String, String> updates) throws Exception {
        ProductEntity productEntity = productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException("Product not found."));
        productEntity = (ProductEntity) updateUtils.update(productEntity,updates);

        ProductEntity saved = productRepository.save(productEntity);
        return productMapper.toProductDto(saved);
    }

    @Transactional
    public ProductDto delete(Long id) {
        ProductEntity productEntity = productRepository
                .findById(id).orElseThrow(() -> new ProductNotFoundException("Product not found."));

        productEntity.setStatus(Status.CLOSED);
        productRepository.save(productEntity);
        return productMapper.toProductDto(productEntity);
    }

    @Transactional
    public ProductDto remove(Long id) {
        ProductDto productDto = findById(id);
        productRepository.deleteById(id);
        return productDto;
    }
}
