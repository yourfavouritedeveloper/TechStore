package com.tech.store.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentSummaryDto {

    private Long id;

    private String comment;

    private AccountSummaryDto fromAccount;

    private List<Long> repliesId;

    private Integer likes;

    private BigDecimal rate;

    private AccountSummaryDto toAccount;

    private Long repliedCommentId;

    private Long productId;
}
