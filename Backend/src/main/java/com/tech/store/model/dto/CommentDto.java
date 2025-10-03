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

import java.math.BigDecimal;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor

public class CommentDto {

    private Long id;

    @NotNull(message = "The comment sender cannot be null.",groups = {OnCreate.class, OnUpdate.class})
    private AccountSummaryDto fromAccount;

    private AccountSummaryDto toAccount;

    private CommentSummaryDto repliedComment;

    private List<CommentSummaryDto> replies;

    private Integer like;

    private BigDecimal rate;

    @NotEmpty(message = "The comment cannot be empty.",groups = {OnCreate.class, OnUpdate.class})
    private String comment;

    @NotNull(message = "Product cannot be null.", groups = {OnCreate.class, OnUpdate.class})
    private ProductSummaryDto product;

}
