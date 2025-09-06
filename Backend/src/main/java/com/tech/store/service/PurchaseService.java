package com.tech.store.service;

import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.entity.ProductEntity;
import com.tech.store.dao.entity.PurchaseEntity;
import com.tech.store.dao.repository.*;
import com.tech.store.exception.*;
import com.tech.store.mapper.AccountMapper;
import com.tech.store.mapper.ProductMapper;
import com.tech.store.mapper.PurchaseMapper;
import com.tech.store.model.dto.AccountDto;
import com.tech.store.model.dto.ProductDto;
import com.tech.store.model.dto.PurchaseDto;
import com.tech.store.model.enumeration.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseMapper purchaseMapper;
    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductRedisRepository productRedisRepository;
    private final PurchaseRedisRepository purchaseRedisRepository;
    private final AccountRedisRepository accountRedisRepository;
    private final AccountService accountService;
    private final ProductService productService;

    public PurchaseDto findById(Long id) {
        return purchaseRedisRepository.findById(id)
                .orElseGet(() -> {
                    PurchaseEntity purchaseEntity = purchaseRepository.findById(id)
                            .orElseThrow(() -> new PurchaseNotFoundException("Purchase not found"));

                    return purchaseRedisRepository.save(purchaseEntity);


                });
    }

    public List<PurchaseDto> findByAccount(Long id) {
        return purchaseRedisRepository.findByAccount(id)
                .orElseGet(() -> {
                    AccountDto accountDto = accountService.findById(id);
                    List<PurchaseEntity> purchaseEntities = accountDto.getPurchases()
                            .stream().map(purchaseMapper::toPurchaseEntity).toList();

                    purchaseEntities.forEach(purchaseRedisRepository::save);

                    return purchaseEntities.stream().
                            map(purchaseMapper::toPurchaseDto)
                            .toList();



                });
    }


    public List<PurchaseDto> findAll() {
        return purchaseRedisRepository.findAll()
                .orElseGet(() -> {
                    List<PurchaseEntity> purchaseEntities = purchaseRepository.findAll();

                    if (purchaseEntities.isEmpty()) {
                        throw new ProductNotFoundException("Product not found.");
                    }

                    List<PurchaseDto> purchaseDtos = purchaseEntities.stream()
                            .map(purchaseMapper::toPurchaseDto).toList();

                    purchaseEntities.forEach(purchaseRedisRepository::save);

                    return purchaseDtos;
                });
    }

    public List<PurchaseDto> purchase(Long accountId, List<Long> productIds, Long amount) {

        AccountEntity accountEntity = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        List<PurchaseDto> purchaseDtos = new ArrayList<>();

        for (Long productId : productIds) {
            ProductEntity productEntity = productRepository.findById(productId)
                    .orElseThrow(() -> new ProductNotFoundException("Product not found"));

            if (productEntity.getAmount() == 0) throw new InsufficientAmountException("Amount must be greater than zero.");
            if (productEntity.getAmount() < amount) throw new InsufficientAmountException("Insufficient amount.");

            BigDecimal totalCost = productEntity.getPrice().multiply(BigDecimal.valueOf(amount));
            if (accountEntity.getBalance().compareTo(totalCost) < 0)
                throw new InsufficientBalanceException("Insufficient balance.");

            PurchaseEntity purchaseEntity = new PurchaseEntity();
            purchaseEntity.setAccount(accountEntity);
            purchaseEntity.setProductEntity(productEntity);
            purchaseEntity.setPurchaseDate(LocalDateTime.now());
            purchaseEntity.setAmount(amount);

            productEntity.setAmount(productEntity.getAmount() - amount);
            accountEntity.setBalance(accountEntity.getBalance().subtract(totalCost));

            accountEntity.getPurchases().add(purchaseEntity);


            purchaseRepository.save(purchaseEntity);
            productRepository.save(productEntity);
            accountRepository.save(accountEntity);

            purchaseRedisRepository.save(purchaseEntity);
            productRedisRepository.save(productEntity);
            accountRedisRepository.save(accountEntity);

            purchaseDtos.add(purchaseMapper.toPurchaseDto(purchaseEntity));
        }


        return purchaseDtos;
    }

    public PurchaseDto delete(Long id) {
        PurchaseDto purchaseDto = findById(id);
        PurchaseEntity purchaseEntity = purchaseMapper.toPurchaseEntity(purchaseDto);
        purchaseEntity.setStatus(Status.CLOSED);
        purchaseRepository.save(purchaseEntity);
        return purchaseRedisRepository.save(purchaseEntity);
    }

    public String remove(Long id) {
        PurchaseDto purchaseDto = findById(id);
        PurchaseEntity purchaseEntity = purchaseMapper.toPurchaseEntity(purchaseDto);
        purchaseRepository.delete(purchaseEntity);
        return purchaseRedisRepository.delete(purchaseEntity);
    }
}
