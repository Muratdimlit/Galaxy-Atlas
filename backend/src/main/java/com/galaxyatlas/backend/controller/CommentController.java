package com.galaxyatlas.backend.controller;

import com.galaxyatlas.backend.entity.Comment;
import com.galaxyatlas.backend.repository.CommentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@CrossOrigin
public class CommentController {

    private final CommentRepository commentRepository;

    public CommentController(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @PostMapping
    public Comment addComment(@RequestBody Comment comment) {
        return commentRepository.save(comment);
    }

    @GetMapping("/{spaceObjectId}")
    public List<Comment> getComments(@PathVariable Long spaceObjectId) {
        return commentRepository.findBySpaceObjectId(spaceObjectId);
    }

    @PutMapping("/{id}")
    public Comment updateComment(@PathVariable Long id, @RequestBody Comment updatedComment) {
        Comment comment = commentRepository.findById(id).orElseThrow();
        comment.setContent(updatedComment.getContent());
        return commentRepository.save(comment);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentRepository.deleteById(id);
    }
}