package com.tech.store.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentSummaryDto {

    private Long id;

    private String comment;

    private AccountSummaryDto fromAccount;

    private AccountSummaryDto toAccount;

    private Long repliedCommentId;

    private Long productId;
}
