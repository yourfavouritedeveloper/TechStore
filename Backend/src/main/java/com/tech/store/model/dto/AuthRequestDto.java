package com.tech.store.model.dto;

import lombok.Data;

@Data
public class AuthRequestDto {
    private String username;
    private String password;
}
