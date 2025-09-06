package com.tech.store.model.dto;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tech.store.dao.entity.CommentEntity;
import com.tech.store.util.OnCreate;
import com.tech.store.util.OnUpdate;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor

public class CommentDto {

    @NotNull(message = "The comment sender cannot be null.",groups = {OnCreate.class, OnUpdate.class})
    private AccountDto fromAccount;

    private AccountDto toAccount;

    private CommentDto repliedComment;

    @JsonIgnore
    private List<CommentDto> replies;

    @NotEmpty(message = "The comment cannot be empty.",groups = {OnCreate.class, OnUpdate.class})
    private String comment;

    @NotNull(message = "Product cannot be null.", groups = {OnCreate.class, OnUpdate.class})
    private ProductDto product;

}
