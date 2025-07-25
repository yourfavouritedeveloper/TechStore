package com.tech.store.service;

import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.entity.ProductEntity;
import com.tech.store.dao.entity.PurchaseEntity;
import com.tech.store.dao.repository.AccountRepository;
import com.tech.store.dao.repository.ProductRepository;
import com.tech.store.dao.repository.PurchaseRepository;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseMapper purchaseMapper;
    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public PurchaseDto findById(Long id) {
        return purchaseMapper.toPurchaseDto(purchaseRepository.findById(id).orElseThrow(() -> new PurchaseNotFoundException("Purchase not found.")));
    }

    public List<PurchaseDto> findByAccount(Long id) {
        AccountDto accountDto = accountMapper
                .toAccountDto(accountRepository.findById(id)
                        .orElseThrow(() -> new AccountNotFoundException("Account not found.")));

        return accountDto.getPurchases();
    }


    public List<PurchaseDto> findAll() {
        List<PurchaseEntity> purchaseEntities = purchaseRepository.findAll();
        return purchaseEntities.stream()
                .map(purchaseMapper::toPurchaseDto)
                .toList();
    }

    public List<PurchaseDto> purchase(Long accountId, List<Long> productIds, Long amount) {

        AccountEntity accountEntity = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found."));

        List<PurchaseDto> purchaseDtos = new ArrayList<>();

        for (Long productId : productIds) {
            ProductEntity productEntity = productRepository.findById(productId)
                    .orElseThrow(() -> new ProductNotFoundException("Product not found."));

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

            purchaseRepository.save(purchaseEntity);
            productRepository.save(productEntity);

            accountEntity.getPurchases().add(purchaseEntity);

            purchaseDtos.add(purchaseMapper.toPurchaseDto(purchaseEntity));
        }

        accountRepository.save(accountEntity);

        return purchaseDtos;
    }

    public PurchaseDto delete(Long id) {
        PurchaseEntity purchaseEntity = purchaseRepository
                .findById(id).orElseThrow(() -> new PurchaseNotFoundException("Purchase not found."));

        purchaseEntity.setStatus(Status.CLOSED);
        purchaseRepository.save(purchaseEntity);
        return purchaseMapper.toPurchaseDto(purchaseEntity);
    }

    public PurchaseDto remove(Long id) {
        PurchaseDto purchaseDto = findById(id);
        purchaseRepository.deleteById(id);
        return purchaseDto;
    }
}
