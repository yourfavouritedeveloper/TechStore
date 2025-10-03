package com.tech.store.dao.repository;

import com.tech.store.dao.entity.CommentEntity;
import com.tech.store.mapper.CommentMapper;
import com.tech.store.model.dto.CommentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Repository("commentRedisRepository")
@RequiredArgsConstructor
public class CommentRedisRepository {


    private final RedisTemplate<String, CommentDto> commentRedisTemplate;
    private final RedisTemplate<String,String> commentKeysRedisTemplate;
    private final CommentMapper commentMapper;

    private static final String KEY_PREFIX = "comment:";
    private static final String ALL_KEYS_SET= "comment:keys:";

    public Optional<CommentDto> findById(Long id) {
        String key = KEY_PREFIX + id;
        CommentDto commentDto = commentRedisTemplate.opsForValue().get(key);
        return Optional.ofNullable(commentDto);
    }

    public Optional<List<CommentDto>> findBySender(String username) {
        String keySet = KEY_PREFIX + "sender:" + username + ":keys";
        Set<String> keys = commentKeysRedisTemplate.opsForSet().members(keySet);

        if (keys == null || keys.isEmpty()) {
            return Optional.of(List.of());
        }

        List<CommentDto> commentDtos = commentRedisTemplate.opsForValue().multiGet(keys);
        return commentDtos != null ? Optional.of(commentDtos) : Optional.of(List.of());
    }

    public Optional<List<CommentDto>> findByReceiver(String username) {
        String keySet = KEY_PREFIX + "receiver:" + username + ":keys";
        Set<String> keys = commentKeysRedisTemplate.opsForSet().members(keySet);

        if (keys == null || keys.isEmpty()) {
            return Optional.of(List.of());
        }

        List<CommentDto> commentDtos = commentRedisTemplate.opsForValue().multiGet(keys);
        return commentDtos != null ? Optional.of(commentDtos) : Optional.of(List.of());
    }

    public Optional<List<CommentDto>> findAll() {
        Set<String> keys = commentKeysRedisTemplate.opsForSet().members(ALL_KEYS_SET);
        if (keys == null || keys.isEmpty()) {
            return Optional.of(List.of());
        }
        List<CommentDto> commentDtos = commentRedisTemplate.opsForValue().multiGet(keys);
        return commentDtos != null ? Optional.of(commentDtos) : Optional.of(List.of());
    }

    public Optional<List<CommentDto>> findByProduct(Long productId) {
        String keySet = KEY_PREFIX + "product:" + productId + ":keys";
        Set<String> keys = commentKeysRedisTemplate.opsForSet().members(keySet);

        if (keys == null || keys.isEmpty()) {
            return Optional.of(List.of());
        }

        List<CommentDto> commentDtos = commentRedisTemplate.opsForValue().multiGet(keys);
        return commentDtos != null ? Optional.of(commentDtos) : Optional.of(List.of());
    }

    public CommentDto save(CommentEntity commentEntity) {
        String key = KEY_PREFIX + commentEntity.getId();

        CommentDto commentDto = commentMapper.toCommentDto(commentEntity);

        if (commentEntity.getReplies() != null && !commentEntity.getReplies().isEmpty()) {
            commentDto.setReplies(
                    commentEntity.getReplies()
                            .stream()
                            .map(commentMapper::toCommentSummaryDto)
                            .toList()
            );
        }

        commentRedisTemplate.opsForValue().set(key, commentDto);
        commentKeysRedisTemplate.opsForSet().add(ALL_KEYS_SET,key);

        commentKeysRedisTemplate.opsForSet().add(KEY_PREFIX + "sender:" + commentEntity.getFromAccount().getUsername() + ":keys", key);
        if(commentEntity.getToAccount() != null) {
            commentKeysRedisTemplate.opsForSet().add(KEY_PREFIX + "receiver:" + commentEntity.getToAccount().getUsername() + ":keys", key);
        }

        commentKeysRedisTemplate.opsForSet().add(KEY_PREFIX + "product:" + commentEntity.getProduct().getId() + ":keys", key);

        return commentDto;
    }

    public String delete(CommentEntity commentEntity) {
        String key = KEY_PREFIX + commentEntity.getId();
        commentKeysRedisTemplate.opsForSet().remove(ALL_KEYS_SET, key);
        commentRedisTemplate.delete(key);
        return "Deleted.";
    }
}
