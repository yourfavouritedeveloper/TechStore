package com.tech.store.controller;

import com.tech.store.model.dto.ProductDto;
import com.tech.store.service.ProductService;
import com.tech.store.util.OnCreate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Product", description = "APIs for product creation, read, update, and deletion")
public class ProductController {

    private final ProductService productService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get product by id", description = "Gets the specified product.")
    public ProductDto findById(@PathVariable Long id) {
        return productService.findById(id);
    }


    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get all products", description = "Gets all products.")
    public List<ProductDto> getAll() {
        return productService.findAll();
    }


    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new product", description = "Creates an product with provided information.")
    public ProductDto createProduct(@Validated(OnCreate.class) @RequestBody ProductDto accountDto) {
        return productService.create(accountDto);
    }

    @PutMapping("/update/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update product", description = "Updates the specified product.")
    public ProductDto updateProduct(@PathVariable Long id,@RequestParam Map<String, String> updates) throws Exception {
        return productService.updateProduct(id, updates);
    }

    @PutMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Close product", description = "Closes the specified product.")
    public ProductDto deleteProduct(@PathVariable Long id) {
        return productService.delete(id);
    }

    @DeleteMapping("/remove/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Delete product", description = "Deletes the specified product.")
    public ProductDto removeProduct(@PathVariable Long id) {
        return productService.remove(id);
    }



}