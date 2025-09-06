package com.tech.store.mapper;

import com.tech.store.dao.entity.CommentEntity;
import com.tech.store.model.dto.CommentDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    CommentDto toCommentDto(CommentEntity commentEntity);

    CommentEntity toCommentEntity(CommentDto commentDto);
}
