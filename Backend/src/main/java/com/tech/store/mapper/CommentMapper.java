package com.tech.store.mapper;

import com.tech.store.dao.entity.CommentEntity;
import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.model.dto.AccountSummaryDto;
import com.tech.store.model.dto.CommentDto;
import com.tech.store.model.dto.CommentSummaryDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    CommentDto toCommentDto(CommentEntity commentEntity);

    CommentEntity toCommentEntity(CommentDto commentDto);

    default CommentSummaryDto toCommentSummaryDto(CommentEntity commentEntity) {
        if (commentEntity == null) return null;

        CommentSummaryDto summaryDto = new CommentSummaryDto();
        summaryDto.setId(commentEntity.getId());
        summaryDto.setComment(commentEntity.getComment());
        summaryDto.setFromAccount(accountEntityToAccountSummaryDto(commentEntity.getFromAccount()));
        summaryDto.setToAccount(accountEntityToAccountSummaryDto(commentEntity.getToAccount()));
        summaryDto.setLikes(commentEntity.getLikes());
        summaryDto.setRate(commentEntity.getRate());
        summaryDto.setRepliedCommentId(commentEntity.getRepliedComment() != null
                ? commentEntity.getRepliedComment().getId() : null);
        summaryDto.setProductId(commentEntity.getProduct() != null
                ? commentEntity.getProduct().getId() : null);

        if (commentEntity.getReplies() != null && !commentEntity.getReplies().isEmpty()) {
            summaryDto.setRepliesId(commentEntity.getReplies()
                    .stream()
                    .map(CommentEntity::getId)
                    .toList());
        }

        return summaryDto;
    }

    default List<CommentSummaryDto> toCommentSummaryDtoList(List<CommentEntity> entities) {
        if (entities == null) return List.of();
        return entities.stream()
                .map(this::toCommentSummaryDto)
                .toList();
    }

    default AccountSummaryDto accountEntityToAccountSummaryDto(AccountEntity accountEntity) {
        if (accountEntity == null) return null;
        AccountSummaryDto dto = new AccountSummaryDto();
        dto.setId(accountEntity.getId());
        dto.setUsername(accountEntity.getUsername());
        dto.setCustomerName(accountEntity.getCustomerName());
        dto.setDescription(accountEntity.getDescription());
        dto.setProfilePictureUrl(accountEntity.getProfilePictureUrl());
        return dto;
    }


}
