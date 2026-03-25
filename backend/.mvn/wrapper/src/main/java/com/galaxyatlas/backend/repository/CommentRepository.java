package com.galaxyatlas.backend.repository;

import com.galaxyatlas.backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findBySpaceObjectId(Long spaceObjectId);
}