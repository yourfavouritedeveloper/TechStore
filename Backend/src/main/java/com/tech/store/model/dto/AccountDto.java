package com.tech.store.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tech.store.model.enumeration.Role;
import com.tech.store.util.OnCreate;
import com.tech.store.util.OnUpdate;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class AccountDto {

    private Role role;

    @NotBlank(message = "Username cannot be null",groups = {OnCreate.class, OnUpdate.class})
    private String username;

    @NotBlank(message = "Customer name cannot be null",groups = {OnCreate.class,OnUpdate.class})
    private String customerName;

    private String description;

    @NotBlank(message = "Password should be provided",groups = {OnCreate.class,OnUpdate.class})
    private String password;

    @Email(message = "Invalid email for creation",groups = {OnCreate.class,OnUpdate.class})
    private String email;

    private BigDecimal balance;

    private String profilePictureUrl;

    @JsonIgnore
    private List<PurchaseDto> purchases;

    @JsonIgnore
    private List<PurchaseDto> sells;

    @JsonIgnore
    private List<CommentDto> sentComments;

    @JsonIgnore
    private List<CommentDto> receivedComments;

    @JsonIgnore
    private List<ProductDto> products;


}
