package com.tech.store.controller;

import com.tech.store.model.dto.Account;
import com.tech.store.model.dto.AccountDto;
import com.tech.store.model.dto.LoginRequestDto;
import com.tech.store.model.dto.RegisterRequestDto;
import com.tech.store.service.AccountService;
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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@Tag(name = "Account", description = "APIs for account creation, read, update, and deletion")
public class AccountController {

    private final AccountService accountService;
    private final String UPLOAD_DIR = "/app/uploads/";

    @PostMapping("/uploadProfilePicture")
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

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get account by id", description = "Gets the specified account.")
    public AccountDto findById(@PathVariable Long id) {
        return accountService.findById(id);
    }

    @GetMapping("/username/{username}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get account by username", description = "Gets the specified account.")
    public AccountDto findByName(@PathVariable String username) {
        return accountService.findByName(username);
    }


    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get all accounts", description = "Gets all accounts.")
    public List<AccountDto> getAll() {
        return accountService.findAll();
    }


    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register a new account", description = "Creates an account with provided information.")
    public AccountDto register(@Validated(OnCreate.class) @RequestBody RegisterRequestDto registerRequestDto) {
        return accountService.register(registerRequestDto);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Log in an account", description = "Logs an account in provided information.")
    public LoginRequestDto login(@Validated(OnCreate.class) @RequestBody LoginRequestDto loginRequest) {
        return accountService.login(loginRequest);
    }

    @PutMapping("/update")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update account", description = "Updates the specified account.")
    public AccountDto updateAccount(@RequestBody AccountDto accountDto) throws Exception {
        return accountService.updateAccount(accountDto);
    }

    @PutMapping("/password")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Change password", description = "Changes the password of an Account")
    public AccountDto changePassword(@RequestParam Long id, @RequestParam String password) throws Exception {
        return accountService.changePassword(id,password);
    }

    @PutMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Close account", description = "Closes the specified account.")
    public AccountDto deleteAccount(@PathVariable Long id) {
        return accountService.delete(id);
    }

    @DeleteMapping("/remove/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Delete account", description = "Deletes the specified account.")
    public String removeAccount(@PathVariable Long id) {
        return accountService.remove(id);
    }



}
