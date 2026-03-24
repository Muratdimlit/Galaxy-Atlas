package com.galaxyatlas.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long spaceObjectId;

    private String content;

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getSpaceObjectId() {
        return spaceObjectId;
    }

    public String getContent() {
        return content;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setSpaceObjectId(Long spaceObjectId) {
        this.spaceObjectId = spaceObjectId;
    }

    public void setContent(String content) {
        this.content = content;
    }
}