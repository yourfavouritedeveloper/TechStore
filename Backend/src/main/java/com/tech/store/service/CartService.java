package com.tech.store.service;

import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.entity.CartEntity;
import com.tech.store.dao.entity.ProductEntity;
import com.tech.store.dao.repository.AccountRepository;
import com.tech.store.dao.repository.CartRedisRepository;
import com.tech.store.dao.repository.CartRepository;
import com.tech.store.dao.repository.ProductRepository;
import com.tech.store.exception.AccountNotFoundException;
import com.tech.store.exception.CartAlreadyExistsException;
import com.tech.store.exception.CartNotFoundException;
import com.tech.store.exception.ProductNotFoundException;
import com.tech.store.mapper.CartMapper;
import com.tech.store.model.dto.CartDto;
import com.tech.store.model.dto.ProductDto;
import com.tech.store.model.dto.ProductSummaryDto;
import com.tech.store.model.enumeration.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartMapper cartMapper;
    private final CartRepository cartRepository;
    private final CartRedisRepository cartRedisRepository;
    private final AccountRepository accountRepository;
    private final ProductRepository productRepository;

    public CartDto findById(Long id) {
        return cartRedisRepository.findById(id)
                .orElseGet(() -> {
                    CartEntity cartEntity = cartRepository.findById(id)
                            .orElseThrow(() -> new CartNotFoundException("Cart not found"));

                    CartDto cartDto = cartMapper.toCartDto(cartEntity);
                    cartRedisRepository.save(cartEntity);
                    return cartDto;
                });
    }

    public List<CartDto> findAll() {
        return cartRedisRepository.findAll()
                .orElseGet(() -> {
                    List<CartEntity> cartEntities = cartRepository.findAll();

                    if (cartEntities.isEmpty()) {
                        throw new CartNotFoundException("Cart not found.");
                    }

                    List<CartDto> cartDtos = cartEntities.stream()
                            .map(cartMapper::toCartDto).toList();

                    cartEntities.forEach(cartRedisRepository::save);

                    return cartDtos;

                });
    }

    public CartDto findByAccountId(Long accountId) {
        return cartRedisRepository.findByAccount(accountId)
                .orElseGet(() -> {
                    AccountEntity accountEntity = accountRepository.findById(accountId)
                            .orElseThrow(() -> new AccountNotFoundException("Account not found"));

                    CartEntity cartEntity = cartRepository.findByAccount(accountEntity)
                            .orElseThrow(() -> new CartNotFoundException("Cart not found"));

                    CartDto cartDto = cartMapper.toCartDto(cartEntity);
                    cartRedisRepository.save(cartEntity);
                    return cartDto;
                });
    }

    @Transactional
    public CartDto create(CartDto cartDto) {
        Long accountId = cartDto.getAccount().getId();

        if(cartRepository.findById(accountId).isPresent()) {
            throw new CartAlreadyExistsException("Cart already exists.");
        }
        CartEntity cartEntity = cartMapper.toCartEntity(cartDto);

        AccountEntity accountEntity = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        cartEntity.setAccount(accountEntity);
        accountEntity.setCart(cartEntity);

        CartEntity savedCart = cartRepository.save(cartEntity);
        accountRepository.save(accountEntity);


        return cartRedisRepository.save(savedCart);
    }

    @Transactional
    public CartDto update(CartDto cartDto) {
        CartEntity cartEntity = cartMapper.toCartEntity(cartDto);
        cartRepository.save(cartEntity);
        return cartRedisRepository.save(cartEntity);
    }

    @Transactional
    public CartDto addProduct(Long cartId,Long productId) {
        CartEntity cartEntity = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found"));

        ProductEntity productEntity = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        if(cartEntity.getProducts().contains(productEntity)) {
            cartEntity.getAmounts().replace(productEntity.getId(),cartEntity.getAmounts().get(productEntity.getId())+1);
        }
        else {
            cartEntity.getProducts().add(productEntity);
            cartEntity.getAmounts().put(productId, 1L);
        }

        if(productEntity.getDiscount()>0)
        {
            BigDecimal discountMultiplier = BigDecimal.valueOf(100 - productEntity.getDiscount())
                    .divide(BigDecimal.valueOf(100));
            cartEntity.setTotalPrice(
                    cartEntity.getTotalPrice().add(productEntity.getPrice().multiply(discountMultiplier))
            );

        }
        else {
            cartEntity.setTotalPrice(cartEntity.getTotalPrice().add(productEntity.getPrice()));
        }

        CartDto cartDto = cartMapper.toCartDto(cartEntity);
        cartRepository.save(cartEntity);
        cartRedisRepository.save(cartEntity);
        return cartDto;
    }

    @Transactional
    public CartDto removeProduct(Long cartId,Long productId) {

        CartEntity cartEntity = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found"));

        ProductEntity productEntity = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        Long quantity = cartEntity.getAmounts().get(productEntity.getId());
        if (quantity == null) {
            throw new ProductNotFoundException("Product not found");
        } else if (quantity == 1) {
            cartEntity.getAmounts().remove(productEntity.getId());
            cartEntity.getProducts().remove(productEntity);
        } else {
            cartEntity.getAmounts().put(productEntity.getId(), quantity - 1);
        }

        if(productEntity.getDiscount()>0)
        {
            BigDecimal discountMultiplier = BigDecimal.valueOf(100 - productEntity.getDiscount())
                    .divide(BigDecimal.valueOf(100));
            cartEntity.setTotalPrice(
                    cartEntity.getTotalPrice().subtract(productEntity.getPrice().multiply(discountMultiplier))
            );
        }
        else {
            cartEntity.setTotalPrice(cartEntity.getTotalPrice().subtract(productEntity.getPrice()));
        }

        CartDto cartDto = cartMapper.toCartDto(cartEntity);
        cartRepository.save(cartEntity);
        cartRedisRepository.save(cartEntity);
        return cartDto;
    }

    @Transactional
    public CartDto delete(Long id) {
        CartEntity cartEntity = cartRepository.findById(id)
                .orElseThrow(() -> new CartNotFoundException("Cart not found."));

        cartEntity.setStatus(Status.CLOSED);
        cartRedisRepository.save(cartEntity);
        return cartMapper.toCartDto(cartEntity);
    }

    @Transactional
    public String remove(Long id) {
        CartEntity cartEntity = cartRepository.findById(id)
                .orElseThrow(() -> new CartNotFoundException("Cart not found."));
        cartRepository.delete(cartEntity);
        return cartRedisRepository.delete(cartEntity);

    }


}
