package com.tech.store.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentSummaryDto {

    private Long id;

    private String comment;

    private AccountSummaryDto fromAccount;

    private List<Long> repliesId = new ArrayList<>();

    private Integer likes;

    private BigDecimal rate;

    private AccountSummaryDto toAccount;

    private Long repliedCommentId;

    private String repliedUsername;

    private Long productId;
}
