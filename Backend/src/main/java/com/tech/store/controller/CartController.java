package com.tech.store.controller;

import com.tech.store.model.dto.CartDto;
import com.tech.store.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/carts")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "APIs for cart creation, read, update, and deletion")
public class CartController {

    private final CartService cartService;

    @GetMapping("/id/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get cart by id", description = "Gets the specified cart.")
    public CartDto findById(@PathVariable Long id) {
        return cartService.findById(id);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get all carts", description = "Gets all carts.")
    public List<CartDto> findAll() {
        return cartService.findAll();
    }
    @GetMapping("/account/{accountId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get cart by account", description = "Gets the specified cart.")
    public CartDto findByAccount(@PathVariable Long accountId) {
        return cartService.findByAccountId(accountId);
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a cart", description = "Creates a cart.")
    public CartDto create(@RequestBody CartDto cartDto) throws Exception {
        return cartService.create(cartDto);
    }

    @PutMapping("/update")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update a cart", description = "Updates a cart.")
    public CartDto update(@RequestBody CartDto cartDto) throws Exception {
        return cartService.update(cartDto);
    }

    @PutMapping("/add/{cartId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Add a product to a cart", description = "Adds a product to a cart.")
    public CartDto addProduct(@PathVariable Long cartId, @RequestParam Long productId) throws Exception {
        return cartService.addProduct(cartId, productId);
    }

    @PutMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Close cart", description = "Closes the specified cart.")
    public CartDto deletePurchase(@PathVariable Long id) {
        return cartService.delete(id);
    }

    @DeleteMapping("/remove/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Delete cart", description = "Deletes the specified cart.")
    public String removePurchase(@PathVariable Long id) {
        return cartService.remove(id);
    }

}
