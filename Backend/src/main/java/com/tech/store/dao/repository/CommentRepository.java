package com.tech.store.dao.repository;

import com.tech.store.dao.entity.CommentEntity;
import com.tech.store.model.dto.CommentDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    Optional<List<CommentDto>> findByFromAccountUsername(String fromAccountUsername);

    Optional<List<CommentDto>> findByToAccountUsername(String toAccountUsername);
}
