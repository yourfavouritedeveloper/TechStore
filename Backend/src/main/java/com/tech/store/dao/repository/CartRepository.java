package com.tech.store.dao.repository;

import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {
    Optional<CartEntity> findByAccount(AccountEntity account);
}
