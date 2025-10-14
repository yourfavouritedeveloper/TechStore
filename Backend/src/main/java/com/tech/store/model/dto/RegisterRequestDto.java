package com.tech.store.model.dto;

import com.tech.store.model.enumeration.Role;
import com.tech.store.util.OnCreate;
import com.tech.store.util.OnUpdate;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class RegisterRequestDto {


    private String username;

    private String customerName;

    private String password;

    private String description;

    private String email;

    private String profilePictureUrl;


}
