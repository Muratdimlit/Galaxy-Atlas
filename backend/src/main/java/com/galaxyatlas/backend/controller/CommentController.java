package com.galaxyatlas.backend.controller;

import com.galaxyatlas.backend.entity.Comment;
import com.galaxyatlas.backend.repository.CommentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@CrossOrigin
public class CommentController {

    private final CommentRepository repository;

    public CommentController(CommentRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Comment addComment(@RequestBody Comment comment) {
        return repository.save(comment);
    }

    @GetMapping("/{spaceObjectId}")
    public List<Comment> getComments(@PathVariable Long spaceObjectId) {
        return repository.findBySpaceObjectId(spaceObjectId);
    }

    @PutMapping("/{id}")
    public Comment update(@PathVariable Long id, @RequestBody Comment updated) {
        Comment comment = repository.findById(id).orElseThrow();

        comment.setContent(updated.getContent());

        return repository.save(comment);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}