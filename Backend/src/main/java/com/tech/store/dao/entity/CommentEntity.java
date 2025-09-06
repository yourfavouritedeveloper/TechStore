package com.tech.store.dao.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.tech.store.model.dto.AccountDto;
import com.tech.store.model.dto.ProductDto;
import com.tech.store.util.OnCreate;
import com.tech.store.util.OnUpdate;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "comments")
public class CommentEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_account",nullable = false)
    @JsonBackReference
    private AccountEntity fromAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_account")
    @JsonBackReference
    private AccountEntity toAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "replied_comment")
    @JsonBackReference
    private CommentEntity repliedComment;

    @OneToMany(mappedBy = "repliedComment", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<CommentEntity> replies = new ArrayList<>();

    @Column(name="comment",nullable = false)
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product",nullable = false)
    @JsonBackReference
    private ProductEntity product;



}
