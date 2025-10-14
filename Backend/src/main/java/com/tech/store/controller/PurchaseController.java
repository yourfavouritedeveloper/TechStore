package com.tech.store.controller;


import com.stripe.exception.StripeException;
import com.tech.store.model.dto.PurchaseDto;
import com.tech.store.model.dto.PurchaseRequest;
import com.tech.store.model.dto.PurchaseResponse;
import com.tech.store.service.PurchaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/purchases")
@RequiredArgsConstructor
@Tag(name = "Purchase", description = "APIs for purchase creation, read, update, and deletion")
public class PurchaseController {

    private final PurchaseService purchaseService;

    @PostMapping("/checkout")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Make a Checkout", description = "Makes a Checkout.")
    public PurchaseResponse createPurchase(@RequestBody PurchaseDto purchaseDto) throws StripeException {
        return purchaseService.checkoutProduct(purchaseDto);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get purchase by id", description = "Gets the specified purchase.")
    public PurchaseDto findById(@PathVariable Long id) {
        return purchaseService.findById(id);
    }

    @GetMapping("account/from/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get all purchases of the buyer account", description = "Gets the specified purchase.")
    public List<PurchaseDto> findByFromAccount(@PathVariable Long id) {
        return purchaseService.findByFromAccount(id);
    }

    @GetMapping("account/to/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get all purchases of the seller account", description = "Gets the specified purchase.")
    public List<PurchaseDto> findByToAccount(@PathVariable Long id) {
        return purchaseService.findByToAccount(id);
    }


    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get all purchases", description = "Gets all purchases.")
    public List<PurchaseDto> getAll() {
        return purchaseService.findAll();
    }

    @PostMapping("/purchase")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Purchase an item", description = "Makes a purchase")
    public PurchaseDto create(@RequestBody PurchaseDto purchaseDto){
        return purchaseService.purchase(purchaseDto);
    }

    @PutMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Close purchase", description = "Closes the specified purchase.")
    public PurchaseDto deletePurchase(@PathVariable Long id) {
        return purchaseService.delete(id);
    }

    @DeleteMapping("/remove/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Delete purchase", description = "Deletes the specified purchase.")
    public String removePurchase(@PathVariable Long id) {
        return purchaseService.remove(id);
    }
}
