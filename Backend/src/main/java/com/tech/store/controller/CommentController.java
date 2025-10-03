package com.tech.store.controller;

import com.tech.store.model.dto.AccountDto;
import com.tech.store.model.dto.CommentDto;
import com.tech.store.model.dto.PurchaseDto;
import com.tech.store.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
@Tag(name = "Comment", description = "APIs for comment creation, read, update, and deletion")
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get comment by id", description = "Gets the specified comment.")
    public CommentDto findById(@PathVariable Long id) {
        return commentService.findById(id);
    }

    @GetMapping("/fromAccount/{fromAccount}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get comment by sender account", description = "Gets the specified comment.")
    public List<CommentDto> findBySender(@PathVariable String username) {
        return commentService.findBySenderAccount(username);
    }

    @GetMapping("/toAccount/{toAccount}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get comment by receiver account", description = "Gets the specified comment.")
    public List<CommentDto> findByReceiver(@PathVariable String username) {
        return commentService.findByReceiverAccount(username);
    }

    @PostMapping("/comment/{fromAccount}")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Comment to a product", description = "Comments")
    public CommentDto comment(@PathVariable String fromAccount,@RequestParam Long productId, @RequestParam String comment,@RequestParam Integer rate) {
        return commentService.comment(fromAccount, productId, comment,rate);
    }

    @PostMapping("/reply/{commentId}/{fromAccount}/{toAccount}")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Reply to a specified account's comment", description = "Replies to the comment")
    public CommentDto reply(@PathVariable Long commentId,@PathVariable String fromAccount,
                            @PathVariable String toAccount,@RequestParam Long productId,
                            @RequestParam String comment) {
        return commentService.reply(fromAccount,toAccount,commentId,productId, comment);
    }

    @PutMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Close comment", description = "Closes the specified comment.")
    public CommentDto deletePurchase(@PathVariable Long id) {
        return commentService.delete(id);
    }

    @DeleteMapping("/remove/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Delete comment", description = "Deletes the specified comment.")
    public String removePurchase(@PathVariable Long id) {
        return commentService.remove(id);
    }



}
