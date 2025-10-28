package com.tech.store.controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.param.CustomerCreateParams;
import com.tech.store.dao.entity.RefreshToken;
import com.tech.store.exception.RefreshTokenNotFoundException;
import com.tech.store.model.dto.*;
import com.tech.store.service.AccountService;
import com.tech.store.service.JWTService;
import com.tech.store.util.OnCreate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
import redis.clients.jedis.Response;

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
    private final JWTService jwtService;
    private final String UPLOAD_DIR = "/app/uploads/";
    @Value("${stripe.apikey}")
    String stripeKey;

    @PutMapping("/otp/send")
    @ResponseStatus(HttpStatus.OK)
    public String sendOtp(@RequestParam String email) throws MessagingException, IOException {
        accountService.sendOtp(email);
        return "OTP has been sent to your email";
    }

    @PutMapping("/otp/verify")
    @ResponseStatus(HttpStatus.OK)
    public boolean verifyOtp(@RequestParam String email, @RequestParam String requestOtp) {
        return accountService.verifyOtp(email,requestOtp);
    }


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

    @GetMapping("/available/username")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Check if the username is not being used", description = "Checks the validity of username")
    public boolean isAvailableUsername(@RequestParam String username) {
        return accountService.isAvailableUsername(username);
    }

    @GetMapping("/available/email")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Check if the email is not being used", description = "Checks the validity of email")
    public boolean isAvailableEmail(@RequestParam String email) {
        return accountService.isAvailableEmail(email);
    }



    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get account by id", description = "Gets the specified account.")
    public AccountDto findById(@PathVariable Long id) {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        AccountDto myAccount = accountService.findByName(username);

        if (!myAccount.getId().equals(id)) {
            throw new AccessDeniedException("You are not allowed to access this account");
        }

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

    @GetMapping("/email/{email}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get account by email", description = "Gets the specified account.")
    public AccountDto findByEmail(@PathVariable String email) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        AccountDto myAccount = accountService.findByName(username);

        if (!myAccount.getUsername().equals(username)) {
            throw new AccessDeniedException("You are not allowed to access this account");
        }

        return accountService.findByEmail(email);
    }


    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get all accounts", description = "Gets all accounts.")
    public List<AccountDto> getAll() {
        return accountService.findAll();
    }


    @PostMapping("/refreshToken")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Refresh Token", description = "Refresh Token")
    public AuthResponseDto refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) throws IOException {
        return accountService.findByToken(refreshTokenRequest.getToken())
                .map(accountService::verifyRefreshToken)
                .map(RefreshToken::getAccount)
                .map(accountEntity -> {
                    String accessToken = jwtService.generateToken(accountEntity.getUsername());
                    return AuthResponseDto.builder()
                            .token(accessToken)
                            .refreshToken(refreshTokenRequest.getToken())
                            .username(accountEntity.getUsername())
                            .build();
                }).orElseThrow(() -> new RefreshTokenNotFoundException("Refresh token not found"));
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
    public AuthResponseDto login(@Validated(OnCreate.class) @RequestBody AuthRequestDto authRequest) {
        return accountService.login(authRequest);
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
