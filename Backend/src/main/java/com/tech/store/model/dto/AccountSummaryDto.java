package com.tech.store.model.dto;

import com.tech.store.model.enumeration.Role;
import com.tech.store.util.OnCreate;
import com.tech.store.util.OnUpdate;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountSummaryDto {

    private Long id;

    private String username;

    private String customerName;

    private String description;

    private String email;

    private BigDecimal balance;

    private String profilePictureUrl;
}
