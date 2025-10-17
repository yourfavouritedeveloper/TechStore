package com.tech.store.mapper;

import com.tech.store.dao.entity.CommentEntity;
import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.entity.ProductEntity;
import com.tech.store.dao.repository.CommentRepository;
import com.tech.store.dao.repository.ProductRepository;
import com.tech.store.model.dto.AccountSummaryDto;
import com.tech.store.model.dto.CommentDto;
import com.tech.store.model.dto.CommentSummaryDto;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(target = "product", source = "product.id", qualifiedByName = "mapProductIdToEntity")
    @Mapping(target = "repliedComment", source = "repliedComment.id", qualifiedByName = "mapRepliedCommentIdToEntity")
    CommentEntity toCommentEntity(CommentDto dto, @Context ProductRepository productRepo, @Context CommentRepository commentRepo);

    @Mapping(target = "product", source = "product")
    @Mapping(target = "repliedComment", source = "repliedComment")
    CommentDto toCommentDto(CommentEntity entity);


    @Named("mapProductIdToEntity")
    default ProductEntity mapProductIdToEntity(Long productId, @Context ProductRepository productRepository) {
        if (productId == null) return null;
        return productRepository.getReferenceById(productId);
    }

    @Named("mapRepliedCommentIdToEntity")
    default CommentEntity mapRepliedCommentIdToEntity(Long commentId, @Context CommentRepository commentRepository) {
        if (commentId == null) return null;
        return commentRepository.getReferenceById(commentId);
    }

    default CommentSummaryDto toCommentSummaryDto(CommentEntity commentEntity) {
        if (commentEntity == null) return null;

        CommentSummaryDto summaryDto = new CommentSummaryDto();
        summaryDto.setId(commentEntity.getId());
        summaryDto.setComment(commentEntity.getComment());
        summaryDto.setFromAccount(accountEntityToAccountSummaryDto(commentEntity.getFromAccount()));
        summaryDto.setToAccount(accountEntityToAccountSummaryDto(commentEntity.getToAccount()));
        summaryDto.setLikes(commentEntity.getLikes());
        summaryDto.setRate(commentEntity.getRate());
        summaryDto.setRepliedCommentId(commentEntity.getRepliedComment() != null ?
                commentEntity.getRepliedComment().getId() : null);
        summaryDto.setProductId(commentEntity.getProduct().getId());

        if (commentEntity.getReplies() != null && !commentEntity.getReplies().isEmpty()) {
            summaryDto.setRepliesId(commentEntity.getReplies()
                    .stream()
                    .map(CommentEntity::getId)
                    .toList());
        }

        return summaryDto;
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

    @AfterMapping
    default void setProduct(@MappingTarget CommentEntity entity, CommentSummaryDto dto) {
        if (dto.getProductId() != null && entity.getProduct() == null) {
            ProductEntity product = new ProductEntity();
            product.setId(dto.getProductId());
            entity.setProduct(product);
        }
    }

}
