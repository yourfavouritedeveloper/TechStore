package com.tech.store.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.entity.ProductEntity;
import com.tech.store.dao.entity.PurchaseEntity;
import com.tech.store.dao.repository.*;
import com.tech.store.exception.*;
import com.tech.store.mapper.AccountMapper;
import com.tech.store.mapper.ProductMapper;
import com.tech.store.mapper.PurchaseMapper;
import com.tech.store.model.dto.*;
import com.tech.store.model.enumeration.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

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

    @Value("${stripe.apikey}")
    String stripeApikey;





    public PurchaseDto findById(Long id) {
        return purchaseRedisRepository.findById(id)
                .orElseGet(() -> {
                    PurchaseEntity purchaseEntity = purchaseRepository.findById(id)
                            .orElseThrow(() -> new PurchaseNotFoundException("Purchase not found"));

                    return purchaseRedisRepository.save(purchaseEntity);


                });
    }

    public List<PurchaseDto> findByFromAccount(Long id) {
        return purchaseRedisRepository.findByFromAccount(id)
                .orElseGet(() -> {
                    AccountDto accountDto = accountService.findById(id);
                    List<PurchaseEntity> purchaseEntities = accountDto.getPurchases()
                            .stream().map(purchaseSummaryDto -> findById(purchaseSummaryDto.getId()))
                            .map(purchaseMapper::toPurchaseEntity).toList();

                    purchaseEntities.forEach(purchaseRedisRepository::save);

                    return purchaseEntities.stream().
                            map(purchaseMapper::toPurchaseDto)
                            .toList();



                });
    }

    public List<PurchaseDto> findByToAccount(Long id) {
        return purchaseRedisRepository.findByToAccount(id)
                .orElseGet(() -> {
                    AccountDto accountDto = accountService.findById(id);
                    List<PurchaseEntity> purchaseEntities = accountDto.getSells()
                            .stream().map(purchaseSummaryDto -> findById(purchaseSummaryDto.getId()))
                            .map(purchaseMapper::toPurchaseEntity).toList();

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

    public PurchaseResponse checkoutProduct(PurchaseDto purchaseDto, String successUrl, String failUrl) throws StripeException {
        Stripe.apiKey = stripeApikey;

        SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl!= null ? successUrl : "https://yourfavouritedeveloper.github.io/TechStore/#/success")
                .setCancelUrl(successUrl != null ? successUrl : "https://yourfavouritedeveloper.github.io/TechStore/#");

        for (Long productId : purchaseDto.getProductIds()) {
            ProductEntity product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

            Long quantity = purchaseDto.getQuantity() != null
                    ? purchaseDto.getQuantity().getOrDefault(productId, 1L)
                    : 1L;

            SessionCreateParams.LineItem.PriceData.ProductData productData =
                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName(product.getName())
                            .addImage(product.getProductImageUrl())
                            .build();

            BigDecimal discountMultiplier = BigDecimal.valueOf(100 - product.getDiscount())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            long unitAmount = product.getPrice()
                    .multiply(discountMultiplier)
                    .multiply(BigDecimal.valueOf(100))
                    .longValueExact();

            SessionCreateParams.LineItem.PriceData priceData =
                    SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency(purchaseDto.getCurrency() == null ? "AZN" : purchaseDto.getCurrency())
                            .setUnitAmount(unitAmount)
                            .setProductData(productData)
                            .build();

            SessionCreateParams.LineItem lineItem =
                    SessionCreateParams.LineItem.builder()
                            .setQuantity(quantity)
                            .setPriceData(priceData)
                            .build();

            paramsBuilder.addLineItem(lineItem);
        }

        SessionCreateParams params = paramsBuilder.build();
        Session session = Session.create(params);

        return PurchaseResponse.builder()
                .status("SUCCESS")
                .message("PAYMENT SESSION CREATED")
                .sessionId(session.getId())
                .sessionUrl(session.getUrl())
                .build();
    }


    @Transactional
    public PurchaseDto purchase(PurchaseDto purchaseDto){

            List<AccountEntity> sellerAccounts = new ArrayList<>();
            for(Long sellerId : purchaseDto.getSellerIds()) {
                    AccountEntity sellerAccount = accountRepository.findById(sellerId)
                            .orElseThrow(() -> new AccountNotFoundException("Account not found"));

                sellerAccounts.add(sellerAccount);

                }


            AccountEntity buyerAccount = accountRepository.findById(purchaseDto.getBuyerId())
                    .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        if (purchaseDto.getProductIds().isEmpty()) throw new IllegalArgumentException("No products in purchase.");


        BigDecimal totalCost = BigDecimal.ZERO;
            List<ProductEntity> productEntities = new ArrayList<>();
            for(Long productId : purchaseDto.getProductIds()) {
                if (!purchaseDto.getQuantity().containsKey(productId)) {
                    throw new IllegalArgumentException("Missing quantity for product ID " + productId);
                }


                ProductEntity productEntity = productRepository.findById(productId)
                        .orElseThrow(() -> new ProductNotFoundException("Product not found"));


                BigDecimal discountMultiplier = BigDecimal.valueOf(100 - productEntity.getDiscount())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

                BigDecimal totalPrice = productEntity.getPrice()
                        .multiply(discountMultiplier)
                        .multiply(BigDecimal.valueOf(purchaseDto.getQuantity().get(productId)));


                totalCost = totalCost.add(totalPrice);


                productEntities.add(productEntity);
            }


            long amountInCents = totalCost.multiply(BigDecimal.valueOf(100))
                    .setScale(0, RoundingMode.HALF_UP)
                    .longValue();

            purchaseDto.setAmount(amountInCents);

            if (amountInCents == 0) throw new InsufficientAmountException("Amount must be greater than zero.");
            if (buyerAccount.getBalance().compareTo(totalCost) < 0)
                throw new InsufficientBalanceException("Insufficient balance.");


            PurchaseEntity purchaseEntity = new PurchaseEntity();



            purchaseEntity.setBuyer(buyerAccount);
            purchaseEntity.setSellers(sellerAccounts);
            purchaseEntity.setProducts(productEntities);
            purchaseEntity.setPurchaseDate(new Timestamp(System.currentTimeMillis()));
            purchaseEntity.setAmount(purchaseDto.getAmount());
            purchaseEntity.setCurrency(purchaseDto.getCurrency());
            purchaseEntity.setQuantity(purchaseDto.getQuantity());

        productEntities.forEach(productEntity -> {

                productEntity.setAmount(productEntity.getAmount() - purchaseDto.getQuantity().get(productEntity.getId()));
            });


        buyerAccount.setBalance(buyerAccount.getBalance().subtract(totalCost));



        sellerAccounts.forEach(accountEntity -> {

            AtomicReference<BigDecimal> cost = new AtomicReference<>(BigDecimal.ZERO);
                    productEntities.forEach(productEntity -> {
                        if(productEntity.getAccount().getId().equals(accountEntity.getId())) {
                            BigDecimal discountMultiplier = BigDecimal.valueOf(100 - productEntity.getDiscount())
                                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

                            BigDecimal totalPrice = productEntity.getPrice()
                                    .multiply(discountMultiplier)
                                    .multiply(BigDecimal.valueOf(purchaseDto.getQuantity().get(productEntity.getId())));

                            cost.set(cost.get().add(totalPrice));
                        }
                    });
                    BigDecimal finalCost = cost.get();
                    accountEntity.setBalance(accountEntity.getBalance().add(finalCost));
                    accountEntity.getPurchases().add(purchaseEntity);

        });

            purchaseRepository.save(purchaseEntity);
            productRepository.saveAll(productEntities);
            accountRepository.save(buyerAccount);
            accountRepository.saveAll(sellerAccounts);

            purchaseRedisRepository.save(purchaseEntity);
            productEntities.forEach(productRedisRepository::save);
            accountRedisRepository.save(buyerAccount);
            sellerAccounts.forEach(accountRedisRepository::save);

            purchaseEntity.getSellers().size();
            purchaseEntity.getProducts().size();
            purchaseEntity.getQuantity().size();
            purchaseEntity.getBuyer().getId();

            return purchaseMapper.toPurchaseDto(purchaseEntity);



    }




    public PurchaseDto delete(Long id) {
        PurchaseEntity purchaseEntity = purchaseRepository.findById(id)
                .orElseThrow(() -> new PurchaseNotFoundException("Purchase not found"));
        purchaseEntity.setStatus(Status.CLOSED);
        purchaseRepository.save(purchaseEntity);
        return purchaseRedisRepository.save(purchaseEntity);
    }

    public String remove(Long id) {
        PurchaseEntity purchaseEntity = purchaseRepository.findById(id)
                .orElseThrow(() -> new PurchaseNotFoundException("Purchase not found"));
        purchaseRepository.delete(purchaseEntity);
        return purchaseRedisRepository.delete(purchaseEntity);
    }
}
