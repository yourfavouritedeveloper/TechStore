package com.tech.store.controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.param.CustomerCreateParams;
import com.tech.store.model.dto.*;
import com.tech.store.service.AccountService;
import com.tech.store.util.OnCreate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    @Value("${stripe.apikey}")
    String stripeKey;

    @PostMapping("/uploadProfilePicture")
    public ResponseEntity<Map<String, String>> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No file uploaded"));
        }

        try {
            String username = authentication.getName();
            AccountDto account = accountService.findByName(username);

            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            String filename = file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            account.setProfilePictureUrl("https://techstore-3fvk.onrender.com/images/" + filename);
            accountService.updateAccount(account);

            return ResponseEntity.ok(Map.of("url", account.getProfilePictureUrl()));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Could not save file"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get account by id", description = "Gets the specified account.")
    public AccountDto findById(@PathVariable Long id) {

        // Get currently logged-in username from JWT
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Fetch the account of the logged-in user
        AccountDto myAccount = accountService.findByName(username);

        // Check if requested ID matches the logged-in user's ID
        if (!myAccount.getId().equals(id)) {
            throw new AccessDeniedException("You are not allowed to access this account");
        }

        // Return the account (you could also just return `myAccount`)
        return myAccount;
    }

    @GetMapping("/username/{username}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get account by username", description = "Gets the specified account.")
    public AccountDto findByName(@PathVariable String username) {
        String loggedInUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!loggedInUsername.equals(username)) {
            throw new AccessDeniedException("You are not allowed to access this account");
        }

        return accountService.findByName(username);
    }


    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get all accounts", description = "Gets all accounts.")
    public List<AccountDto> getAll() {
        return accountService.findAll();
    }


    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register a new account", description = "Creates an account with provided information.")
    public AccountDto register(@Validated(OnCreate.class) @RequestBody RegisterRequestDto registerRequestDto) throws StripeException {
        Stripe.apiKey = stripeKey;
        CustomerCreateParams params =
                CustomerCreateParams.builder()
                        .setName(registerRequestDto.getCustomerName())
                        .setEmail(registerRequestDto.getEmail())
                        .build();
        Customer customer = Customer.create(params);
        return accountService.register(registerRequestDto,customer.getId());
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Log in an account", description = "Logs an account in provided information.")
    public LoginResponseDto login(@Validated(OnCreate.class) @RequestBody LoginRequestDto loginRequest) {
        return accountService.login(loginRequest);
    }

    @PutMapping("/update")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update account", description = "Updates the specified account.")
    public AccountDto updateAccount(@RequestBody AccountDto accountDto) throws Exception {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AccountDto myAccount = accountService.findByName(username);

        if (!myAccount.getId().equals(accountDto.getId())) {
            throw new AccessDeniedException("You are not allowed to update this account");
        }

        return accountService.updateAccount(accountDto);
    }

    @PutMapping("/password")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Change password", description = "Changes the password of an Account")
    public AccountDto changePassword(@RequestParam Long id, @RequestParam String password) throws Exception {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AccountDto myAccount = accountService.findByName(username);

        if (!myAccount.getId().equals(id)) {
            throw new AccessDeniedException("You are not allowed to change password for this account");
        }

        return accountService.changePassword(id, password);
    }

    @PutMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Close account", description = "Closes the specified account.")
    public AccountDto deleteAccount(@PathVariable Long id) {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AccountDto myAccount = accountService.findByName(username);

        if (!myAccount.getId().equals(id)) {
            throw new AccessDeniedException("You are not allowed to delete this account");
        }

        return accountService.delete(id);
    }

    @DeleteMapping("/remove/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Delete account", description = "Deletes the specified account.")
    public String removeAccount(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AccountDto myAccount = accountService.findByName(username);

        if (!myAccount.getId().equals(id)) {
            throw new AccessDeniedException("You are not allowed to remove this account");
        }

        return accountService.remove(id);
    }



}
