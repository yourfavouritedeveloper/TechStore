package com.tech.store.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentSummaryDto {

    private Long id;

    private String comment;

    private AccountSummaryDto fromAccount;

    private Integer likes;

    private BigDecimal rate;

    private AccountSummaryDto toAccount;

    private Long repliedCommentId;

    private Long productId;
}
