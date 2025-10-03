package com.tech.store.service;

import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.entity.CommentEntity;
import com.tech.store.dao.entity.ProductEntity;
import com.tech.store.dao.entity.PurchaseEntity;
import com.tech.store.dao.repository.*;
import com.tech.store.exception.*;
import com.tech.store.mapper.AccountMapper;
import com.tech.store.mapper.CommentMapper;
import com.tech.store.mapper.ProductMapper;
import com.tech.store.model.dto.AccountDto;
import com.tech.store.model.dto.CommentDto;
import com.tech.store.model.dto.CommentSummaryDto;
import com.tech.store.model.dto.PurchaseDto;
import com.tech.store.model.enumeration.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final AccountRepository accountRepository;
    private final ProductRepository productRepository;
    private final CommentMapper commentMapper;
    private final AccountMapper accountMapper;
    private final ProductMapper productMapper;
    private final CommentRedisRepository commentRedisRepository;
    private final ProductRedisRepository productRedisRepository;
    private final AccountRedisRepository accountRedisRepository;


    public CommentDto findById(Long id) {
        return commentRedisRepository.findById(id)
                .orElseGet(() -> {
                    CommentEntity commentEntity = commentRepository.findById(id)
                            .orElseThrow(() -> new CommentNotFoundException("Comment not found"));

                    return commentRedisRepository.save(commentEntity);


                });
    }

    public List<CommentDto> findBySenderAccount(String username) {
        return commentRedisRepository.findBySender(username)
                .orElseGet(() -> {
                    AccountEntity accountEntity = accountRepository.findByUsername(username)
                            .orElseThrow(() -> new AccountNotFoundException("Account not found"));

                    List<CommentEntity> commentEntities = accountEntity.getSentComments()
                            .stream().toList();

                    commentEntities.forEach(commentRedisRepository::save);

                    return commentEntities.stream().
                            map(commentMapper::toCommentDto)
                            .toList();



                });
    }

    public List<CommentDto> findByReceiverAccount(String username) {
        return commentRedisRepository.findByReceiver(username)
                .orElseGet(() -> {
                    AccountEntity accountEntity = accountRepository.findByUsername(username)
                            .orElseThrow(() -> new AccountNotFoundException("Account not found"));

                    List<CommentEntity> commentEntities = accountEntity.getReceivedComments()
                            .stream().toList();

                    commentEntities.forEach(commentRedisRepository::save);

                    return commentEntities.stream().
                            map(commentMapper::toCommentDto)
                            .toList();



                });
    }


    public List<CommentDto> findAll() {
        return commentRedisRepository.findAll()
                .orElseGet(() -> {
                    List<CommentEntity> commentEntities = commentRepository.findAll();

                    if (commentEntities.isEmpty()) {
                        throw new CommentNotFoundException("Comment not found.");
                    }

                    List<CommentDto> commentDtos = commentEntities.stream()
                            .map(commentMapper::toCommentDto).toList();

                    commentEntities.forEach(commentRedisRepository::save);

                    return commentDtos;
                });
    }

    public List<CommentDto> findByProduct(Long productId) {
        return commentRedisRepository.findByProduct(productId)
                .orElseGet(() -> {
                    ProductEntity productEntity = productRepository.findById(productId)
                            .orElseThrow(() -> new ProductNotFoundException("Product not found"));


                    List<CommentEntity> commentEntities = productEntity.getComments()
                            .stream().toList();

                    if (commentEntities.isEmpty()) {
                        throw new CommentNotFoundException("Comment not found.");
                    }

                    commentEntities.forEach(commentRedisRepository::save);

                    return commentEntities.stream().
                            map(commentMapper::toCommentDto)
                            .toList();
                });
    }




    public CommentDto comment(String fromUsername, Long productId,String comment,Integer rate) {

        AccountEntity fromAccount = accountRepository.findByUsername(fromUsername)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        ProductEntity productEntity = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        CommentEntity commentEntity = new CommentEntity();


        commentEntity.setFromAccount(fromAccount);
        commentEntity.setProduct(productEntity);
        commentEntity.setComment(comment);
        commentEntity.setLikes(0);
        commentEntity.setRate(BigDecimal.valueOf(rate));

        fromAccount.getSentComments().add(commentEntity);
        productEntity.getComments().add(commentEntity);


        commentRepository.save(commentEntity);
        productRepository.save(productEntity);
        accountRepository.save(fromAccount);

        commentRedisRepository.save(commentEntity);
        productRedisRepository.save(productEntity);
        accountRedisRepository.save(fromAccount);

        return commentMapper.toCommentDto(commentEntity);
    }



    public CommentDto reply(String fromUsername,String toUsername,Long repliedCommentId, Long productId,String comment) {

        AccountEntity fromAccount = accountRepository.findByUsername(fromUsername)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        AccountEntity toAccount = accountRepository.findByUsername(toUsername)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        ProductEntity productEntity = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        CommentEntity commentEntity = new CommentEntity();

        CommentEntity repliedComment = commentRepository.findById(repliedCommentId)
                        .orElseThrow(() -> new CommentNotFoundException("Comment not found"));


        commentEntity.setFromAccount(fromAccount);
        commentEntity.setToAccount(toAccount);
        commentEntity.setComment(comment);
        commentEntity.setProduct(productEntity);
        commentEntity.setRepliedComment(repliedComment);


        fromAccount.getSentComments().add(commentEntity);
        toAccount.getReceivedComments().add(commentEntity);
        productEntity.getComments().add(commentEntity);
        repliedComment.getReplies().add(commentEntity);

        commentRepository.save(commentEntity);
        commentRepository.save(repliedComment);
        productRepository.save(productEntity);
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        commentRedisRepository.save(commentEntity);
        commentRedisRepository.save(repliedComment);
        productRedisRepository.save(productEntity);
        accountRedisRepository.save(fromAccount);
        accountRedisRepository.save(toAccount);

        CommentDto commentDto = commentMapper.toCommentDto(commentEntity);


        return commentDto;
    }




    public CommentDto delete(Long id) {
        CommentEntity commentEntity = commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException("Comment not found"));
        commentEntity.setStatus(Status.CLOSED);
        commentRepository.save(commentEntity);
        return commentRedisRepository.save(commentEntity);
    }

    public String remove(Long id) {
        CommentEntity commentEntity = commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException("Comment not found"));
        commentRepository.delete(commentEntity);
        return commentRedisRepository.delete(commentEntity);
    }
}

