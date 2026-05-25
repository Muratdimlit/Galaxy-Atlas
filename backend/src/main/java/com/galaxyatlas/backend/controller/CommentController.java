package com.galaxyatlas.backend.controller;

import com.galaxyatlas.backend.entity.Comment;
import com.galaxyatlas.backend.entity.User;
import com.galaxyatlas.backend.repository.CommentRepository;
import com.galaxyatlas.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/comments")
@CrossOrigin
public class CommentController {

    private final CommentRepository repository;
    private final UserRepository userRepository;

    public CommentController(CommentRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Comment addComment(@RequestBody Comment comment) {
        Comment savedComment = repository.save(comment);
        return addUserName(savedComment);
    }

    @GetMapping("/{spaceObjectId}")
    public List<Comment> getComments(@PathVariable Long spaceObjectId) {
        return repository.findBySpaceObjectId(spaceObjectId)
                .stream()
                .map(this::addUserName)
                .toList();
    }

    @PutMapping("/{id}")
    public Comment update(@PathVariable Long id, @RequestBody Comment updated) {
        Comment comment = repository.findById(id).orElseThrow();

        comment.setContent(updated.getContent());

        Comment savedComment = repository.save(comment);
        return addUserName(savedComment);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }

    private Comment addUserName(Comment comment) {
        if (comment.getUserId() == null) {
            comment.setUserName("Bilinmeyen Kullanıcı");
            return comment;
        }

        Optional<User> user = userRepository.findById(comment.getUserId());

        if (user.isPresent()) {
            comment.setUserName(user.get().getName());
        } else {
            comment.setUserName("Kullanıcı #" + comment.getUserId());
        }

        return comment;
    }
}