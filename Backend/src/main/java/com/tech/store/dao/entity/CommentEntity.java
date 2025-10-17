package com.tech.store.dao.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "comments")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class CommentEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_account",nullable = false)
    @JsonBackReference("account-sent-comments")
    private AccountEntity fromAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_account")
    @JsonBackReference("account-received-comments")
    private AccountEntity toAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "replied_comment")
    @JsonBackReference("comment-replies")
    private CommentEntity repliedComment;

    @OneToMany(mappedBy = "repliedComment", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference("comment-replies")
    private List<CommentEntity> replies = new ArrayList<>();

    @Column(name="comment", length = 5000,nullable = false)
    private String comment;

    @Column(name="likes")
    private Integer likes;

    @Column(name="rate")
    private BigDecimal rate;

    @Column(name="replied_username")
    private String repliedUsername;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product",nullable = false)
    @JsonBackReference("product-comments")
    private ProductEntity product;

    @ElementCollection
    @CollectionTable(
            name = "comment_likes",
            joinColumns = @JoinColumn(name = "comment_id")
    )
    @Column(name = "liked_by")
    private List<String> likedBy = new ArrayList<>();


}
