package com.tech.store.controller;

import com.tech.store.model.dto.AccountDto;
import com.tech.store.model.dto.ProductDto;
import com.tech.store.service.ProductService;
import com.tech.store.util.OnCreate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Product", description = "APIs for product creation, read, update, and deletion")
public class ProductController {

    private final ProductService productService;
    private final String UPLOAD_DIR = "/app/uploads/";
    private final String PRODUCT_VIDEO_UPLOAD_DIR = "/app/product-videos/";

    @PostMapping("/uploadProductVideo")
    public ResponseEntity<Map<String, String>> uploadProductVideo(
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No video uploaded"));
        }

        try {
            File uploadDir = new File(PRODUCT_VIDEO_UPLOAD_DIR);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            String lowerName = filename.toLowerCase();
            if (!(lowerName.endsWith(".mp4") || lowerName.endsWith(".mov") || lowerName.endsWith(".avi") || lowerName.endsWith(".mkv"))) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid video format. Allowed: mp4, mov, avi, mkv"));
            }

            Path filePath = Paths.get(PRODUCT_VIDEO_UPLOAD_DIR, filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "https://techstore-3fvk.onrender.com/videos/" + filename;

            return ResponseEntity.ok(Map.of("url", fileUrl));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Could not save video"));
        }
    }

    @PostMapping("/uploadProductImage")
    public ResponseEntity<Map<String, String>> uploadProfilePicture(
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No file uploaded"));
        }

        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "https://techstore-3fvk.onrender.com/images/" + filename;
            return ResponseEntity.ok(Map.of("url", fileUrl));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Could not save file"));
        }
    }


    @GetMapping("/id/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get product by id", description = "Gets the specified product.")
    public ProductDto findById(@PathVariable Long id) {
        return productService.findById(id);
    }

    @GetMapping("/name/{name}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get product by id", description = "Gets the specified product.")
    public ProductDto findById(@PathVariable String name) {
        return productService.findByName(name);
    }



    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get all products", description = "Gets all products.")
    public List<ProductDto> getAll() {
        return productService.findAll();
    }

    @GetMapping("/account")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get all products being sold by an account", description = "Gets products of an account.")
    public List<ProductDto> getByAccount(AccountDto accountDto) {
        return productService.findByAccount(accountDto);
    }

    @GetMapping("/popular")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get the most popular products", description = "Gets the most popular 5 products.")
    public List<ProductDto> getPopular() {
        return productService.findByMostPopular();
    }

    @GetMapping("/bought")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get the most bought products", description = "Gets the most bought 5 products.")
    public List<ProductDto> getBought() {
        return productService.findByMostBought();
    }


    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new product", description = "Creates an product with provided information.")
    public ProductDto createProduct(@Validated(OnCreate.class) @RequestBody ProductDto accountDto) {
        return productService.create(accountDto);
    }

    @PutMapping("/update")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update product", description = "Updates the specified product.")
    public ProductDto updateProduct(@RequestBody ProductDto productDto) throws Exception {
        return productService.updateProduct(productDto);
    }

    @PutMapping("/update/rating/{productId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update product rating", description = "Updates the specified product's rating.")
    public ProductDto updateProductRating(@PathVariable Long productId, BigDecimal rating) throws Exception {
        return productService.updateRating(productId, rating);
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
    public String removeProduct(@PathVariable Long id) {
        return productService.remove(id);
    }



}