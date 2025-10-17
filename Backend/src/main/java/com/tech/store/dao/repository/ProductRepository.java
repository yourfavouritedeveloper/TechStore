package com.tech.store.dao.repository;

import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity,Long> {
    Optional<ProductEntity> findByName(String name);

    List<ProductEntity> findByAccountId(Long id);
}
